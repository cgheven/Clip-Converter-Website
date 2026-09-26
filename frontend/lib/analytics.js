/**
 * One place for every analytics call on the site.
 *
 * Two sinks, deliberately different jobs:
 *   - GA4      audience, acquisition, AdSense/Search Console pairing.
 *   - PostHog  product funnels, error taxonomy, retention, replays.
 *
 * Everything goes through track(); nothing calls gtag or posthog directly,
 * so an event can never land in one tool and not the other.
 *
 * Privacy rule for this file: a pasted link is user content. We send the
 * platform and the host, never the URL, never the video id, never the
 * title. Same rule for anything else typed into the page.
 */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
const PH_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
// Ad-blocker-resistant path (rewritten to PostHog in next.config.js).
const PH_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || '/ingest';
const PH_UI_HOST = process.env.NEXT_PUBLIC_POSTHOG_UI_HOST || 'https://us.posthog.com';

let ph = null;          // the posthog-js module, once it has arrived
let phLoading = false;
const queue = [];       // events fired before the library finished loading

/**
 * Boots PostHog once, client-side.
 *
 * The library is imported dynamically rather than bundled into _app: as a
 * static import it added ~95 kB gzip to the first load of every page,
 * including the article pages whose whole job is ranking in search. Loaded
 * this way it costs nothing on the critical path, and the queue below means
 * no event is lost while it is still in flight.
 */
export function initAnalytics() {
  if (phLoading || ph || !PH_KEY || typeof window === 'undefined') return;
  phLoading = true;

  const load = () => import('posthog-js').then(({ default: posthog }) => {
    posthog.init(PH_KEY, {
      api_host: PH_HOST,
      ui_host: PH_UI_HOST,
      // Pages Router: we send pageviews ourselves on routeChangeComplete,
      // otherwise client-side navigations are invisible.
      capture_pageview: false,
      // Off: $pageleave would be a second billed event on every single
      // visit, and nothing in the dashboard depends on it.
      capture_pageleave: false,
      // Nobody signs in here, so every event is anonymous. This keeps
      // PostHog from billing a person profile per visitor while still
      // counting unique users off the distinct_id.
      person_profiles: 'identified_only',
      // Off by default: the hand-written events already cover the funnel,
      // and autocapture is what burns the event quota on a high-traffic
      // utility site. Turn it on for a week when exploring a new surface.
      autocapture: process.env.NEXT_PUBLIC_POSTHOG_AUTOCAPTURE === 'true',
      disable_session_recording: process.env.NEXT_PUBLIC_POSTHOG_RECORDING !== 'true',
      session_recording: {
        maskAllInputs: true, // the URL field is an input, never record it
        maskTextSelector: '[data-ph-mask]',
      },
      // Respect the browser signal rather than arguing with it.
      respect_dnt: true,
    });
    ph = posthog;
    for (const args of queue.splice(0)) posthog.capture(...args);
  }).catch(() => {
    // Blocked or offline. GA carries on; the queue is dropped on unload.
    phLoading = false;
  });

  // Never compete with the first paint or with the ad script.
  if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(load, { timeout: 3000 });
  else setTimeout(load, 1200);
}

/** Captures now, or holds the call until the library has loaded. */
function toPostHog(...args) {
  if (!PH_KEY) return;
  if (ph) ph.capture(...args);
  else if (queue.length < 20) queue.push(args);
}

/**
 * Sends one event to both sinks.
 * @param {string} name  snake_case, stable, past tense (GA4 caps at 40 chars).
 * @param {object} props flat primitives only, GA4 drops nested objects.
 */
export function track(name, props = {}) {
  if (typeof window === 'undefined') return;
  const clean = {};
  for (const [k, v] of Object.entries(props)) {
    if (v === undefined || v === null || v === '') continue;
    clean[k] = v;
  }
  if (GA_ID && typeof window.gtag === 'function') window.gtag('event', name, clean);
  toPostHog(name, clean);
}

/**
 * Page view on first load and on every client-side route change.
 * `skipGa` is for the very first view: gtag('config') already sends that
 * one itself, and sending it twice would double every landing-page count.
 */
export function trackPageview(path, { skipGa = false } = {}) {
  if (typeof window === 'undefined') return;
  const url = path || window.location.pathname + window.location.search;
  if (!skipGa && GA_ID && typeof window.gtag === 'function') {
    window.gtag('event', 'page_view', {
      page_path: url,
      page_location: window.location.href,
      page_title: document.title,
    });
  }
  toPostHog('$pageview', { $current_url: window.location.origin + url });
}

/* ------------------------------------------------------------------ */
/* Derivations: keep these here so every event labels things the same  */
/* ------------------------------------------------------------------ */

const PLATFORM_HOSTS = [
  [/(^|\.)youtube\.com$|(^|\.)youtu\.be$|(^|\.)youtube-nocookie\.com$/, 'youtube'],
  [/(^|\.)tiktok\.com$/, 'tiktok'],
  [/(^|\.)instagram\.com$/, 'instagram'],
  [/(^|\.)facebook\.com$|(^|\.)fb\.watch$/, 'facebook'],
  [/(^|\.)twitter\.com$|(^|\.)x\.com$/, 'x'],
  [/(^|\.)pinterest\.[a-z.]+$|(^|\.)pin\.it$/, 'pinterest'],
  [/(^|\.)reddit\.com$|(^|\.)redd\.it$/, 'reddit'],
  [/(^|\.)vimeo\.com$/, 'vimeo'],
  [/(^|\.)dailymotion\.com$|(^|\.)dai\.ly$/, 'dailymotion'],
  [/(^|\.)twitch\.tv$/, 'twitch'],
  [/(^|\.)soundcloud\.com$/, 'soundcloud'],
  [/(^|\.)linkedin\.com$/, 'linkedin'],
  [/(^|\.)snapchat\.com$/, 'snapchat'],
  [/(^|\.)bilibili\.com$/, 'bilibili'],
];

/** URL to a low-cardinality platform label. Never returns the URL itself. */
export function platformOf(rawUrl) {
  try {
    const host = new URL(String(rawUrl).trim()).hostname.toLowerCase().replace(/^www\./, '');
    for (const [re, name] of PLATFORM_HOSTS) if (re.test(host)) return name;
    // The bare host is safe and tells us which site to support next.
    return `other:${host}`;
  } catch {
    return 'invalid_url';
  }
}

/** Server or network error text to a short, groupable reason code. */
export function errorReason(message, fallback = 'unknown') {
  const m = String(message || '').toLowerCase();
  if (!m) return fallback;
  if (m.includes('reach the server') || m.includes('connection')) return 'network_unreachable';
  if (m.includes('rate') || m.includes('too many')) return 'rate_limited';
  if (m.includes('private') || m.includes('login') || m.includes('sign in') || m.includes('member')) return 'auth_required';
  if (m.includes('unsupported') || m.includes('not supported')) return 'unsupported_site';
  if (m.includes('not found') || m.includes('unavailable') || m.includes('removed') || m.includes('deleted')) return 'media_unavailable';
  if (m.includes('blocked') || m.includes('region') || m.includes('country')) return 'geo_blocked';
  if (m.includes('age')) return 'age_restricted';
  if (m.includes('live')) return 'live_stream';
  if (m.includes('expired')) return 'job_expired';
  if (m.includes('timeout') || m.includes('timed out')) return 'timeout';
  if (m.includes('could not be read') || m.includes('could not be started')) return 'lookup_rejected';
  return fallback;
}

/** Quality height off an option id like "v1080", else off its label. */
export function qualityOf(option) {
  if (!option) return undefined;
  const m = /^v(\d+)$/.exec(option.id || '');
  if (m) return Number(m[1]);
  if (option.label) {
    const l = /(\d{3,4})p/.exec(option.label);
    if (l) return Number(l[1]);
  }
  return undefined;
}
