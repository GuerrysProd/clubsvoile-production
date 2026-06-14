'use client';

import Link from 'next/link';
import { useState } from 'react';
import { slugify } from '@/lib/slug';
import { FRANCE_REGION_PATHS, FRANCE_VIEWBOX } from '@/lib/france-regions-paths';

export type GeoRegion = { slug: string; name: string; departments: number; clubs: number };

export default function FranceRegionMap({ regions }: { regions: GeoRegion[] }) {
  const [hovered, setHovered] = useState<string | null>(null);

  // Index des données (nb de clubs / slug) par nom de région.
  const byName = new Map<string, GeoRegion>();
  regions.forEach((r) => byName.set(r.name, r));

  // Régions présentes dans les données mais hors carte métropolitaine
  // (outre-mer : La Réunion, etc.) → affichées en encart sous la carte.
  const mappedNames = new Set(FRANCE_REGION_PATHS.map((p) => p.name));
  const overseas = regions.filter((r) => !mappedNames.has(r.name));

  const hoveredData = hovered ? byName.get(hovered) : null;

  return (
    <div className="france-map">
      <div className="france-map-svg-wrap">
        <svg viewBox={FRANCE_VIEWBOX} className="france-svg" role="img" aria-label="Carte des régions de France">
          {FRANCE_REGION_PATHS.map((p) => {
            const data = byName.get(p.name);
            const count = data?.clubs ?? 0;
            const slug = data?.slug ?? slugify(p.name);
            const isActive = hovered === p.name;
            const clickable = count > 0;

            const shape = (
              <>
                <path
                  d={p.d}
                  className={
                    'france-region' +
                    (clickable ? '' : ' france-region--empty') +
                    (isActive ? ' is-active' : '')
                  }
                />
                {count > 0 && (
                  <text x={p.cx} y={p.cy} className="france-region-count" textAnchor="middle">
                    {count}
                  </text>
                )}
                <title>{`${p.name} — ${count} club${count > 1 ? 's' : ''}`}</title>
              </>
            );

            return clickable ? (
              <Link
                key={p.name}
                href={`/${slug}`}
                className="france-region-link"
                onMouseEnter={() => setHovered(p.name)}
                onMouseLeave={() => setHovered((h) => (h === p.name ? null : h))}
                onFocus={() => setHovered(p.name)}
                onBlur={() => setHovered((h) => (h === p.name ? null : h))}
              >
                {shape}
              </Link>
            ) : (
              <g key={p.name} onMouseEnter={() => setHovered(p.name)} onMouseLeave={() => setHovered((h) => (h === p.name ? null : h))}>
                {shape}
              </g>
            );
          })}
        </svg>

        <div className={'france-map-info' + (hoveredData ? ' is-visible' : '')} aria-hidden="true">
          {hoveredData ? (
            <>
              <span className="name">{hoveredData.name}</span>
              <span className="count">
                {hoveredData.clubs} club{hoveredData.clubs > 1 ? 's' : ''} · {hoveredData.departments} dép.
              </span>
            </>
          ) : (
            <span className="hint">Survolez une région</span>
          )}
        </div>
      </div>

      {overseas.length > 0 && (
        <div className="france-others">
          {overseas.map((r) => (
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
