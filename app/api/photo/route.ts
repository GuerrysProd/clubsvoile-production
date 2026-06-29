import { NextRequest, NextResponse } from 'next/server';

// Proxy de photos Google Places.
//
// Certaines fiches stockent un « photo_reference » brut (jeton Google) au lieu
// d'une URL d'image complète. Plutôt que d'écrire la clé API Google dans la
// colonne `photos` (publique, donc fuite de credential), on stocke en base un
// lien neutre `/api/photo?ref=<jeton>` et on résout l'image ici, côté serveur,
// où la clé reste confinée.
//
// On RELAIE directement les octets de l'image (on suit le redirect Google
// automatiquement et on renvoie le corps), plutôt que de renvoyer un 307 vers
// lh3.googleusercontent.com. Avantages : réponse same-origin déterministe,
// compatible avec l'optimiseur next/image (qui ne suit pas toujours les
// redirects cross-origin), et la clé n'apparaît jamais côté client.

export const runtime = 'nodejs';
// Cache CDN long : un photo_reference donné pointe toujours vers la même image.
export const revalidate = 86400;

const KEY = process.env.GOOGLE_PLACES_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY || '';

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get('ref');
  const maxwidth = req.nextUrl.searchParams.get('w') || '1200';

  if (!ref || !KEY) {
    return new NextResponse(null, { status: 404 });
  }

  const googleUrl =
    `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${encodeURIComponent(maxwidth)}` +
    `&photo_reference=${encodeURIComponent(ref)}&key=${KEY}`;

  try {
    // `redirect: 'follow'` (défaut) : fetch suit le 302 Google et récupère
    // directement les octets de l'image finale.
    const res = await fetch(googleUrl);

    if (!res.ok) {
      return new NextResponse(null, { status: 404 });
    }

    const buf = await res.arrayBuffer();
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': res.headers.get('content-type') || 'image/jpeg',
        'Cache-Control': 'public, max-age=86400, s-maxage=604800, immutable',
      },
    });
  } catch {
    return new NextResponse(null, { status: 502 });
  }
}
