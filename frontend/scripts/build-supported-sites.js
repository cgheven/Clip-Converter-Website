/** One-off/occasionally-rerun generator: turns the locally-installed yt-dlp's
 * own extractor list into frontend/data/supported-sites.json for the
 * /supported-sites page. Run with: node scripts/build-supported-sites.js
 * (needs yt-dlp on PATH — same binary the backend uses). Re-run whenever
 * yt-dlp is upgraded to pick up newly added sites. */
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const YTDLP = process.env.YTDLP_PATH || 'yt-dlp';

function run(args) {
  return execFileSync(YTDLP, args, { maxBuffer: 1024 * 1024 * 20 }).toString();
}

const listRaw = run(['--list-extractors']);
const descRaw = run(['--extractor-descriptions']);

// id -> broken flag, from `--list-extractors` (one id per line, broken ones
// suffixed " (CURRENTLY BROKEN)")
const brokenIds = new Set();
for (const line of listRaw.split(/\r?\n/)) {
  const m = line.match(/^(.*?) \(CURRENTLY BROKEN\)$/);
  if (m) brokenIds.add(m[1].trim());
}

// id -> description, from `--extractor-descriptions` (format "id: description",
// but id itself may contain ":" for sub-extractors like "17live:clip" — the
// id/description boundary is the first ": " (colon+space), not just ":").
const entries = [];
for (const line of descRaw.split(/\r?\n/)) {
  if (!line.trim()) continue;
  const sepIdx = line.indexOf(': ');
  const id = sepIdx === -1 ? line.trim() : line.slice(0, sepIdx).trim();
  const desc = sepIdx === -1 ? '' : line.slice(sepIdx + 2).trim();
  if (!id || id.toLowerCase() === 'generic') continue;
  if (brokenIds.has(id)) continue;
  entries.push({ id, desc });
}

// Group sub-extractors ("17live:clip", "17live:vod") under their base site
// ("17live") — supportedsites.md-style granularity is more than a normal
// visitor needs; one entry per site family reads far cleaner.
const byBase = new Map();
for (const { id, desc } of entries) {
  const base = id.split(':')[0];
  const key = base.toLowerCase();
  const existing = byBase.get(key);
  // Prefer the shortest id (the base extractor itself) and, among ties, the
  // longest non-empty description (most informative).
  if (
    !existing ||
    id.length < existing.id.length ||
    (id.length === existing.id.length && desc.length > existing.desc.length)
  ) {
    byBase.set(key, { id: base, desc });
  }
}

// Second pass: yt-dlp also has separate, differently-named classes for the
// same platform that the colon-grouping above can't catch — e.g. "Instagram"
// and "InstagramIOS" are unrelated id strings, not "instagram" + "instagram:ios".
// Collapse any longer entry whose normalized name contains a shorter one's
// (min 4 chars, to avoid over-merging on short generic ids) into that
// shorter, more recognizable entry — this is what keeps YouTube/Instagram/
// Facebook/Pinterest/TikTok down to one clean listing each instead of 3-4
// near-duplicates.
const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
const families = [...byBase.values()].sort((a, b) => norm(a.id).length - norm(b.id).length);
const absorbed = new Set();
for (let i = 0; i < families.length; i++) {
  if (absorbed.has(i)) continue;
  const baseNorm = norm(families[i].id);
  if (baseNorm.length < 4) continue;
  for (let j = i + 1; j < families.length; j++) {
    if (absorbed.has(j)) continue;
    if (norm(families[j].id).includes(baseNorm)) {
      absorbed.add(j);
      if (!families[i].desc && families[j].desc) families[i].desc = families[j].desc;
    }
  }
}

// yt-dlp prefixes some descriptions with "[internal_id] " (e.g. "[10play]",
// "[youtube] YouTube") — that bracket tag is implementation detail, not
// something a visitor needs to see.
const stripBracketTag = (s) => s.replace(/^\[[^\]]+\]\s*/, '').trim();

const sites = families
  .filter((_, i) => !absorbed.has(i))
  .map(({ id, desc }) => {
    const cleaned = stripBracketTag(desc);
    return {
      name: id,
      // Fall back to the id itself when yt-dlp has no human description —
      // most ids are already a recognizable site/domain name.
      note: cleaned && cleaned.toLowerCase() !== id.toLowerCase() ? cleaned : '',
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

const outPath = path.join(__dirname, '..', 'data', 'supported-sites.json');
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(sites, null, 0));

console.log(`Wrote ${sites.length} sites to ${outPath}`);
