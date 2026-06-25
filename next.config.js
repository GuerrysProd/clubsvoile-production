/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  // Redirige les variantes d'orthographe / synonymes tapés directement vers le
  // slug canonique de la page-pilier d'activité (le slug réel est dérivé de la
  // clé d'activité, cf. lib/activities.ts). Récupère le trafic type-in.
  async redirects() {
    return [
      { source: '/efoil', destination: '/e-foil', permanent: true },
      { source: '/e-foil-electrique', destination: '/e-foil', permanent: true },
      { source: '/planche-a-voile', destination: '/planche-a-voile-windsurf', permanent: true },
      { source: '/windsurf', destination: '/planche-a-voile-windsurf', permanent: true },
      { source: '/stand-up-paddle', destination: '/paddle', permanent: true },
      { source: '/paddle-board', destination: '/paddle', permanent: true },
      { source: '/canoe-kayak', destination: '/kayak', permanent: true },
      { source: '/kite-surf', destination: '/kitesurf', permanent: true },
      { source: '/wing-foil', destination: '/wingfoil', permanent: true },
    ];
  },
};

module.exports = nextConfig;
