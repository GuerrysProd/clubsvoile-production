// lib/googlePlacesScraper.ts
import { supabase } from './supabase';

const GOOGLE_PLACES_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

// Types de recherche par région
const SEARCH_QUERIES = [
  // PACA
  { query: 'club de voile Marseille', region: 'PACA', department: '13' },
  { query: 'club de voile Cannes', region: 'PACA', department: '06' },
  { query: 'club de voile Nice', region: 'PACA', department: '06' },
  { query: 'club de voile Antibes', region: 'PACA', department: '06' },
  { query: 'club de voile Toulon', region: 'PACA', department: '83' },
  { query: 'club de voile Hyères', region: 'PACA', department: '83' },
  { query: 'école de voile Sainte-Maxime', region: 'PACA', department: '83' },
  { query: 'club de voile Fréjus', region: 'PACA', department: '83' },

  // Bretagne
  { query: 'club de voile Brest', region: 'Bretagne', department: '29' },
  { query: 'club de voile Saint-Malo', region: 'Bretagne', department: '35' },
  { query: 'club de voile Vannes', region: 'Bretagne', department: '56' },
  { query: 'club de voile Belle-Île', region: 'Bretagne', department: '56' },
  { query: 'club de voile Lorient', region: 'Bretagne', department: '56' },
  { query: 'club de voile Concarneau', region: 'Bretagne', department: '29' },

  // Normandie
  { query: 'club de voile Honfleur', region: 'Normandie', department: '14' },
  { query: 'club de voile Deauville', region: 'Normandie', department: '14' },
  { query: 'club de voile Cherbourg', region: 'Normandie', department: '50' },

  // Pays de la Loire
  { query: 'club de voile La Baule', region: 'Pays de la Loire', department: '44' },
  { query: 'club de voile Pornic', region: 'Pays de la Loire', department: '44' },
  { query: 'club de voile Saint-Nazaire', region: 'Pays de la Loire', department: '44' },

  // Nouvelle-Aquitaine
  { query: 'club de voile Arcachon', region: 'Nouvelle-Aquitaine', department: '33' },
  { query: 'club de voile Hossegor', region: 'Nouvelle-Aquitaine', department: '40' },
  { query: 'club de voile La Rochelle', region: 'Nouvelle-Aquitaine', department: '17' },
];

interface PlacesResult {
  name: string;
  formatted_address: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    weekday_text: string[];
  };
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
  rating?: number;
  user_ratings_total?: number;
  photos?: Array<{ photo_reference: string }>;
}

export async function searchGooglePlaces(query: string, region: string, department: string) {
  try {
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
      query
    )}&key=${GOOGLE_PLACES_API_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.results && data.results.length > 0) {
      return data.results.map((place: PlacesResult) => {
        const address = place.formatted_address || '';
        const [street, city, ...rest] = address.split(',');

        return {
          name: place.name,
          description: `Club de voile - ${place.formatted_address}`,
          region,
          department,
          city: city?.trim() || '',
          address: street?.trim() || '',
          zip_code: extractZipCode(address),
          phone: place.formatted_phone_number || '',
          email: '', // À récupérer manuellement
          website: place.website || '',
          google_maps_url: `https://www.google.com/maps/search/${encodeURIComponent(
            place.name
          )}`,
          latitude: place.geometry?.location.lat || 0,
          longitude: place.geometry?.location.lng || 0,
          activities: extractActivities(place.name),
          age_range: ['Enfants', 'Ados', 'Adultes'],
          schedule_open: formatSchedule(place.opening_hours?.weekday_text),
          logo_url: '',
          photos: place.photos ? place.photos.map((p) => p.photo_reference) : [],
          rating: place.rating || 0,
          review_count: place.user_ratings_total || 0,
          is_premium: false,
          google_place_id: place.place_id,
        };
      });
    }

    return [];
  } catch (error) {
    console.error('Error searching Google Places:', error);
    return [];
  }
}

export async function scrapeAllClubs() {
  try {
    const allClubs = [];

    for (const { query, region, department } of SEARCH_QUERIES) {
      console.log(`Scraping: ${query}`);
      const clubs = await searchGooglePlaces(query, region, department);
      allClubs.push(...clubs);

      // Respecter les limites de l'API
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Dédupliquer par google_place_id
    const uniqueClubs = Array.from(
      new Map(allClubs.map((club) => [club.google_place_id, club])).values()
    );

    console.log(`Found ${uniqueClubs.length} unique clubs`);

    // Sauvegarder dans Supabase
    for (const club of uniqueClubs) {
      const { error } = await supabase
        .from('clubs')
        .upsert([club], { onConflict: 'google_place_id' });

      if (error) {
        console.error(`Error saving club ${club.name}:`, error);
      }
    }

    return uniqueClubs;
  } catch (error) {
    console.error('Error scraping clubs:', error);
    return [];
  }
}

function extractZipCode(address: string): string {
  const match = address.match(/\b\d{5}\b/);
  return match ? match[0] : '';
}

function extractActivities(name: string): string[] {
  const activities = ['Voilier'];

  if (name.toLowerCase().includes('dériveur')) activities.push('Dériveur');
  if (name.toLowerCase().includes('catamaran')) activities.push('Catamaran');
  if (name.toLowerCase().includes('planche')) activities.push('Planche à voile');
  if (name.toLowerCase().includes('wing')) activities.push('Wingfoil');
  if (name.toLowerCase().includes('croisière')) activities.push('Croisière');

  return activities;
}

function formatSchedule(weekdayText?: string[]): string {
  if (!weekdayText || weekdayText.length === 0) return 'Horaires non disponibles';
  return weekdayText[0];
}
