'use client';

import { useEffect, useRef } from 'react';

interface Club {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  rating: number;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function MapGoogle({ clubs }: { clubs: Club[] }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Charge Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY}&libraries=marker`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);

    function initMap() {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        zoom: 6,
        center: { lat: 46.2276, lng: 2.2137 }, // Centre France
      });

      // Ajoute les marqueurs
      clubs.forEach(club => {
        if (club.latitude && club.longitude) {
          new window.google.maps.Marker({
            position: { lat: club.latitude, lng: club.longitude },
            map: mapInstance.current,
            title: club.name,
            label: {
              text: '⛵',
              fontSize: '20px',
            },
          });
        }
      });
    }

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [clubs]);

  return (
    <div
      ref={mapRef}
      style={{
        width: '100%',
        height: '600px',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
}
