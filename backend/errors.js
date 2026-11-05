/** Maps raw yt-dlp / extractor error text to a message safe to show a user.
 * Shared by the website and the Android app (the app additionally strips any
 * message that mentions YouTube before display). */

// yt-dlp appends this boilerplate to *every* unexpected extractor failure, on
// any site: "...; please report this issue on https://github.com/yt-dlp/yt-dlp/issues?q= ,
// filling out the appropriate issue template. Confirm you are on the latest
// version using yt-dlp -U". It says nothing about what actually went wrong, so
// it's removed before matching — otherwise words in it ("Confirm you", "issue")
// leak into the branches below. This was the TikTok-labelled-as-YouTube bug.
const YTDLP_REPORT_BOILERPLATE = /;?\s*please report this issue on[\s\S]*?(yt-dlp -U|$)/gi;

// server.js keeps only the last 300-400 chars of stderr, which can cut the
// boilerplate's head off and leave just this tail.
const YTDLP_REPORT_TAIL = /(filling out the appropriate issue template\.?\s*)?confirm you are on the latest version using yt-dlp -U/gi;

function stripBoilerplate(raw = '') {
  return String(raw).replace(YTDLP_REPORT_BOILERPLATE, ' ').replace(YTDLP_REPORT_TAIL, ' ');
}

/** YouTube's bot wall: "Sign in to confirm you're not a bot" (straight or
 * curly apostrophe). Matched on the "not a bot" phrase only — "confirm you"
 * by itself also appears in the generic boilerplate above and in YouTube's
 * age gate ("Sign in to confirm your age"), neither of which is a bot block. */
const YOUTUBE_BOT_WALL = /not a bot/;

function friendlyError(raw = '') {
  const s = stripBoilerplate(raw).toLowerCase();
  // Must be checked before the private/login branch: the bot-wall text also
  // contains "sign in", which would otherwise be misreported as a private video.
  if (YOUTUBE_BOT_WALL.test(s))
    return 'YouTube is temporarily blocking automated requests for this video. Try again shortly.';
  if (s.includes('private') || s.includes('login') || s.includes('cookies'))
    return 'This content is private or needs a login, so it cannot be fetched.';
  if (s.includes('unsupported url') || s.includes('no video'))
    return 'That link is not supported. Try a direct link to a single video or post.';
  if (s.includes('unavailable') || s.includes('removed'))
    return 'This video is unavailable or has been removed.';
  if (s.includes('timeout') || s.includes('too long'))
    return 'This took too long to process. Try a shorter video or a lower quality.';
  if (s.includes('geo') || s.includes('country'))
    return 'This video is blocked in the server region.';
  // HTTP 429 can come from any site, not just YouTube — keep the label neutral.
  if (s.includes('429') || s.includes('too many requests'))
    return 'The site is rate-limiting requests right now. Wait a minute and try again.';
  if (s.includes('subtitle') || s.includes('caption'))
    return "That subtitle language isn't available for this video right now. Try a different language.";
  return 'Something went wrong while processing this link. Try again or pick a different quality.';
}

module.exports = { friendlyError, stripBoilerplate };
