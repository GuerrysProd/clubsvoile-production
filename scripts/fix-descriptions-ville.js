// Corrige le nom de ville dans les descriptions générées par IA, suite à la
// correction des champs `city` (cf. backup-villes-2026-06-29.csv).
//
// Sécurité : on ne touche QUE le motif prose « à <ancienne ville> » (ex.
// « situé à Lanmeur », « Basé à Vescovato »). Les chaînes d'adresse brutes du
// type « … 13016 Marseille, France » ne contiennent pas ce motif et restent
// donc intactes (le « , France » final est le pays, pas la ville).
//
// Usage : node scripts/fix-descriptions-ville.js          (dry-run, n'écrit rien)
//         node scripts/fix-descriptions-ville.js --apply  (applique en base)

const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const env = {};
for (const l of fs.readFileSync('.env.local', 'utf8').split('\n')) {
  const m = l.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
const sb = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const APPLY = process.argv.includes('--apply');
const clean = (s) => (s || '').replace(/^\d{4,5}\s+/, '').trim();
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function parseCsv(t) {
  const lines = t.trim().split('\n');
  const h = lines[0].split(',');
  return lines.slice(1).map((l) => {
    const cells = [];
    let cur = '', q = false;
    for (const ch of l) {
      if (ch === '"') q = !q;
      else if (ch === ',' && !q) { cells.push(cur); cur = ''; }
      else cur += ch;
    }
    cells.push(cur);
    const o = {};
    h.forEach((k, i) => (o[k] = cells[i]));
    return o;
  });
}

// Remplace « à <oldCity> » / « À <oldCity> » par « à <newCity> », en gardant la
// préposition d'origine. \b en fin gère ponctuation et fin de mot.
function fixDescription(desc, oldCity, newCity) {
  const re = new RegExp('([Àà]\\s+)' + esc(oldCity) + '\\b', 'g');
  return desc.replace(re, (_m, prep) => prep + newCity);
}

(async () => {
  const bak = parseCsv(fs.readFileSync('scripts/backup-villes-2026-06-29.csv', 'utf8'));
  const oldById = new Map(bak.map((r) => [r.id, clean(r.city)]));

  let all = [];
  for (let f = 0; f < 1300; f += 1000) {
    const { data } = await sb.from('clubs').select('id,name,city,description').range(f, f + 999);
    if (!data || !data.length) break;
    all.push(...data);
    if (data.length < 1000) break;
  }

  let changed = 0, applied = 0, fail = 0;
  const samples = [];
  for (const c of all) {
    const oldCity = oldById.get(c.id);
    const newCity = clean(c.city);
    if (!oldCity || !newCity || oldCity.toLowerCase() === newCity.toLowerCase() || !c.description) continue;
    const next = fixDescription(c.description, oldCity, newCity);
    if (next === c.description) continue;
    changed++;
    if (samples.length < 8) samples.push(`[${c.name}] "${oldCity}"→"${newCity}"\n   ${next.slice(0, 150)}`);
    if (APPLY) {
      const { error } = await sb.from('clubs').update({ description: next }).eq('id', c.id);
      if (error) { fail++; if (fail < 5) console.log('ERR', c.name, error.message); } else applied++;
    }
  }
  console.log(`descriptions à corriger: ${changed}`);
  samples.forEach((s) => console.log(s + '\n'));
  if (APPLY) console.log(`appliquées: ${applied} | échecs: ${fail}`);
  else console.log('(dry-run — relancer avec --apply pour écrire)');
})();
