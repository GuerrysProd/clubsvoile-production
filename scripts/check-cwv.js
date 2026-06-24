// Suivi Core Web Vitals via l'API PageSpeed Insights (lab + terrain CrUX).
// Usage : node scripts/check-cwv.js [url1 url2 ...]
// Sans argument : teste un échantillon représentatif de chaque type de page.
// Clé API optionnelle : PAGESPEED_API_KEY (sinon quota anonyme, limité).
const fs = require('fs');

try {
  fs.readFileSync(require('path').join(__dirname, '..', '.env.local'), 'utf8')
    .split('\n').forEach((l) => { const m = l.match(/^([A-Z0-9_]+)=(.*)$/); if (m) process.env[m[1]] = m[2]; });
} catch {}

const KEY = process.env.PAGESPEED_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || '';
const BASE = 'https://clubsvoile.fr';
const DEFAULT = [
  '/',                                                       // accueil
  '/catamaran',                                              // activité
  '/catamaran/toulon',                                       // activité × ville
  '/provence-alpes-cote-d-azur',                             // région
  '/provence-alpes-cote-d-azur/var/toulon',                  // ville
  '/provence-alpes-cote-d-azur/var/toulon/yacht-club-de-toulon', // fiche club
];

const urls = process.argv.slice(2).length ? process.argv.slice(2) : DEFAULT.map((p) => BASE + p);
const ms = (v) => (v == null ? '—' : Math.round(v) + ' ms');

async function run(url, strategy) {
  const api = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}&category=performance${KEY ? `&key=${KEY}` : ''}`;
  const res = await fetch(api);
  if (!res.ok) return { url, strategy, error: `HTTP ${res.status}` };
  const j = await res.json();
  const a = j.lighthouseResult?.audits || {};
  const score = Math.round((j.lighthouseResult?.categories?.performance?.score ?? 0) * 100);
  const field = j.loadingExperience?.metrics;
  const fieldCat = j.loadingExperience?.overall_category;
  return {
    url, strategy, score,
    lab: {
      LCP: a['largest-contentful-paint']?.numericValue,
      CLS: a['cumulative-layout-shift']?.displayValue,
      TBT: a['total-blocking-time']?.numericValue,
      FCP: a['first-contentful-paint']?.numericValue,
      TTFB: a['server-response-time']?.numericValue,
    },
    field: field ? {
      cat: fieldCat,
      LCP: field.LARGEST_CONTENTFUL_PAINT_MS?.percentile,
      INP: field.INTERACTION_TO_NEXT_PAINT?.percentile,
      CLS: field.CUMULATIVE_LAYOUT_SHIFT_SCORE?.percentile,
    } : null,
  };
}

(async () => {
  console.log(KEY ? '(clé API utilisée)' : '(quota anonyme — limité)');
  for (const url of urls) {
    const r = await run(url, 'mobile');
    if (r.error) { console.log(`\n❌ ${url} — ${r.error}`); continue; }
    console.log(`\n${url}  [mobile]  Perf: ${r.score}/100`);
    console.log(`  LAB    LCP ${ms(r.lab.LCP)} · TBT ${ms(r.lab.TBT)} · CLS ${r.lab.CLS} · FCP ${ms(r.lab.FCP)} · TTFB ${ms(r.lab.TTFB)}`);
    if (r.field) console.log(`  TERRAIN (${r.field.cat})  LCP ${ms(r.field.LCP)} · INP ${ms(r.field.INP)} · CLS ${(r.field.CLS / 100).toFixed(2)}`);
    else console.log('  TERRAIN : pas encore de données CrUX (trafic insuffisant)');
  }
})();
