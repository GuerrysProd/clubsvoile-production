'use client';

import Link from 'next/link';

export type GeoRegion = { slug: string; name: string; departments: number; clubs: number };

// Position approximative de chaque région métropolitaine sur une grille 6x6,
// pour une carte stylisée "tile map" de la France (du nord-ouest au sud-est).
const GRID: Record<string, { col: number; row: number }> = {
  'Hauts-de-France': { col: 3, row: 1 },
  Normandie: { col: 1, row: 2 },
  'Île-de-France': { col: 3, row: 2 },
  'Grand Est': { col: 5, row: 2 },
  Bretagne: { col: 0, row: 3 },
  'Pays de la Loire': { col: 1, row: 3 },
  'Centre-Val de Loire': { col: 3, row: 3 },
  'Bourgogne-Franche-Comté': { col: 5, row: 3 },
  'Nouvelle-Aquitaine': { col: 1, row: 4 },
  'Auvergne-Rhône-Alpes': { col: 4, row: 4 },
  Occitanie: { col: 2, row: 5 },
  "Provence-Alpes-Côte d'Azur": { col: 4, row: 5 },
  Corse: { col: 5, row: 6 },
};

export default function FranceRegionMap({ regions }: { regions: GeoRegion[] }) {
  const known = regions.filter((r) => GRID[r.name]);
  const others = regions.filter((r) => !GRID[r.name]);

  return (
    <div className="france-map">
      <div className="france-grid">
        {known.map((r) => {
          const pos = GRID[r.name];
          return (
            <Link
              key={r.slug}
              href={`/${r.slug}`}
              className="france-tile"
              style={{ gridColumn: pos.col + 1, gridRow: pos.row }}
              title={`${r.name} — ${r.clubs} club${r.clubs > 1 ? 's' : ''}`}
            >
              <span className="name">{r.name}</span>
              <span className="count">{r.clubs}</span>
            </Link>
          );
        })}
      </div>

      {others.length > 0 && (
        <div className="france-others">
          {others.map((r) => (
            <Link key={r.slug} href={`/${r.slug}`} className="geo-card">
              <span className="name">{r.name}</span>
              <span className="count">{r.clubs} club{r.clubs > 1 ? 's' : ''}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
