// Génère lib/france-regions-paths.ts à partir des contours GeoJSON des régions
// françaises (france-geojson, données IGN domaine public).
// Usage : node scripts/gen-france-regions.js
const fs = require('fs');
const SRC = 'https://raw.githubusercontent.com/gregoiredavid/france-geojson/master/regions-version-simplifiee.geojson';

main();
async function main() {
  const res = await fetch(SRC);
  if (!res.ok) throw new Error('Téléchargement GeoJSON échoué: ' + res.status);
  const gj = await res.json();
  build(gj);
}

function build(gj) {

// Projection equirectangulaire avec correction longitude (cos lat moyen)
const MEAN_LAT = 46.6 * Math.PI/180;
const KX = Math.cos(MEAN_LAT);
const px = (lon,lat)=>[lon*KX, -lat]; // y inversé

// Bounds globaux
let minX=Infinity,minY=Infinity,maxX=-Infinity,maxY=-Infinity;
const eachRing = (geom, cb) => {
  if(geom.type==='Polygon') geom.coordinates.forEach(r=>cb(r));
  else if(geom.type==='MultiPolygon') geom.coordinates.forEach(p=>p.forEach(r=>cb(r)));
};
for(const f of gj.features){
  eachRing(f.geometry,(ring)=>{ for(const [lon,lat] of ring){ const [x,y]=px(lon,lat);
    if(x<minX)minX=x; if(y<minY)minY=y; if(x>maxX)maxX=x; if(y>maxY)maxY=y; }});
}
const W=1000, PAD=8;
const scale=(W-2*PAD)/(maxX-minX);
const H=Math.round((maxY-minY)*scale+2*PAD);
const tx=(x)=>+ (PAD+(x-minX)*scale).toFixed(1);
const ty=(y)=>+ (PAD+(y-minY)*scale).toFixed(1);

const ringToPath=(ring)=>{
  let d='';
  ring.forEach(([lon,lat],i)=>{ const [x,y]=px(lon,lat); d+=(i===0?'M':'L')+tx(x)+' '+ty(y); });
  return d+'Z';
};
// centroïde (area-weighted) d'un ring projeté pour placer le label
const ringCentroid=(ring)=>{
  let a=0,cx=0,cy=0; const pts=ring.map(([lon,lat])=>{const [x,y]=px(lon,lat);return [tx(x),ty(y)];});
  for(let i=0;i<pts.length-1;i++){const [x0,y0]=pts[i],[x1,y1]=pts[i+1];const cr=x0*y1-x1*y0;a+=cr;cx+=(x0+x1)*cr;cy+=(y0+y1)*cr;}
  a*=0.5; if(Math.abs(a)<1e-6){return [pts[0][0],pts[0][1],0];}
  return [+(cx/(6*a)).toFixed(1), +(cy/(6*a)).toFixed(1), Math.abs(a)];
};

const out=[];
for(const f of gj.features){
  const name=f.properties.nom;
  let d=''; let best=[0,0,-1];
  if(f.geometry.type==='Polygon'){
    f.geometry.coordinates.forEach(r=>{ d+=ringToPath(r); });
    const c=ringCentroid(f.geometry.coordinates[0]); if(c[2]>best[2])best=c;
  } else {
    f.geometry.coordinates.forEach(poly=>{ poly.forEach((r,i)=>{ d+=ringToPath(r); if(i===0){const c=ringCentroid(r); if(c[2]>best[2])best=c;} }); });
  }
  out.push({name, d, cx:best[0], cy:best[1]});
}

const ts=`// AUTO-GÉNÉRÉ depuis france-geojson (regions-version-simplifiee, domaine public IGN).
// Projection equirectangulaire (cos lat moyen), viewBox 0 0 ${W} ${H}.
// Régénérer : node scripts/gen-france-regions.js
export const FRANCE_VIEWBOX = '0 0 ${W} ${H}';
export type RegionPath = { name: string; d: string; cx: number; cy: number };
export const FRANCE_REGION_PATHS: RegionPath[] = ${JSON.stringify(out)};
`;
fs.writeFileSync('lib/france-regions-paths.ts', ts);
console.log('viewBox 0 0', W, H, '| régions:', out.map(o=>o.name).join(', '));
console.log('taille fichier:', fs.statSync('lib/france-regions-paths.ts').size, 'octets');
}
