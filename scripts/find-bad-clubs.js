// Script de diagnostic : liste les clubs dont le nom contient un des mots-clés
// "hors voile" (plongée, ski nautique, wakeboard, jet ski, aviron, football)
// sauf si "voile" apparaît aussi dans le nom.
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const envPath = path.join(__dirname, '..', '.env.local');
fs.readFileSync(envPath, 'utf8').split('\n').forEach((line) => {
  const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
  if (m) process.env[m[1]] = m[2];
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const KEYWORDS = ['plongée', 'plongee', 'ski nautique', 'wakeboard', 'jet ski', 'aviron', 'football'];

(async () => {
  let all = [];
  let from = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('clubs')
      .select('id,name,city,activities')
      .range(from, from + pageSize - 1);
    if (error) { console.error(error); process.exit(1); }
    all = all.concat(data);
    if (data.length < pageSize) break;
    from += pageSize;
  }

  console.log(`Total clubs: ${all.length}`);

  const matches = all.filter((c) => {
    const name = (c.name || '').toLowerCase();
    if (name.includes('voile')) return false;
    return KEYWORDS.some((k) => name.includes(k));
  });

  console.log(`Clubs à retirer: ${matches.length}\n`);
  matches.forEach((c) => console.log(`${c.id}  |  ${c.name}  |  ${c.city}`));
})();
