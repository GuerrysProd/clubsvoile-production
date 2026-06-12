'use client';

interface Club {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  rating: number;
}

export default function MapSimple({ clubs }: { clubs: Club[] }) {
  if (!clubs.length) return <div style={{ textAlign: 'center', padding: '20px' }}>Aucun club à afficher</div>;

  // Utilise OpenStreetMap via une iframe simple
  const club = clubs[0];
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${club.longitude - 0.05},${club.latitude - 0.05},${club.longitude + 0.05},${club.latitude + 0.05}&layer=mapnik&marker=${club.latitude},${club.longitude}`;

  return (
    <div style={{ width: '100%', height: '500px', borderRadius: '8px', overflow: 'hidden' }}>
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={mapUrl}
        style={{ border: 'none' }}
      />
    </div>
  );
}
