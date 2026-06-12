'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
// import MarkerClusterGroup from 'leaflet.markercluster'; // TODO: Fix types

interface Club {
  id: string;
  name: string;
  city: string;
  latitude: number;
  longitude: number;
  rating: number;
}

export default function Map({ clubs }: { clubs: Club[] }) {
  const mapRef = useRef<L.Map | null>(null);
  // const markersRef = useRef<L.MarkerClusterGroup | null>(null); // TODO: Fix types

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([46.2276, 2.2137], 6);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    clubs.forEach(club => {
      L.marker([club.latitude, club.longitude])
        .bindPopup(`<b>${club.name}</b><br>${club.city}<br>⭐ ${club.rating}`)
        .addTo(mapRef.current!);
    });
  }, [clubs]);

  return <div id="map" style={{ width: '100%', height: '500px' }} />;
}
