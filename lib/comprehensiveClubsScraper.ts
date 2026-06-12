import { supabase } from './supabase';

// LISTE EXHAUSTIVE DE TOUTES LES VILLES CÔTIÈRES FRANÇAISES
const COASTAL_CITIES = [
  // BRETAGNE (35, 56, 29)
  'Brest', 'Vannes', 'Saint-Malo', 'Lorient', 'Concarneau', 'Quiberon', 'Belle-Île-en-Mer',
  'Dinard', 'Saint-Briac-sur-Mer', 'Pléneuf-Val-André', 'Saint-Lunaire', 'Roscoff',
  'Douarnenez', 'Audierne', 'Groix', 'Île-de-Groix', 'Carnac', 'La Trinité-sur-Mer',
  'Arradon', 'Séné', 'Saint-Philibert', 'Plouhinec', 'Guilvinec', 'Pont-l\'Abbé',
  'Ploubazlanec', 'Paimpol', 'Tréguier', 'Lannion', 'Perros-Guirec', 'Ploumanac\'h',
  'Trébeurden', 'Locquirec', 'Lanmeur', 'Morlaix', 'Carantec', 'Plouezoc\'h',
  'Landéda', 'Lampaul-Plouarzel', 'Argenton-en-Landunvez', 'Plouarzel', 'Commana',
  'Clohars-Carnoët', 'Clohars-Fouesnant', 'Fouesnant', 'Bénodet', 'Combrit', 'Île-de-Sein',
  'Crozon', 'Camaret-sur-Mer', 'Morgat', 'Télégramme', 'Ploemeur', 'Larmor-Plage',
  'Groix', 'Morbihan', 'Plouha', 'Saint-Quay-Portrieux', 'Étables-sur-Mer',
  
  // NORMANDIE (14, 50, 76)
  'Honfleur', 'Deauville', 'Trouville-sur-Mer', 'Cherbourg-en-Cotentin', 'Barfleur',
  'Saint-Vaast-la-Hougue', 'Étretat', 'Fécamp', 'Dieppe', 'Le Havre', 'Montivilliers',
  'Cabourg', 'Dives-sur-Mer', 'Ouistreham', 'Courseulles-sur-Mer', 'Grandcamp-Maisy',
  'Isigny-sur-Mer', 'Saint-Lô', 'Carentan-les-Marais', 'Normandy', 'Houlgate',
  'Villers-sur-Mer', 'Blonville-sur-Mer', 'Benerville-sur-Mer', 'Pennedepie',
  'Le Havre', 'Honfleur', 'Harfleur', 'Saint-Adresse', 'Sainte-Adresse', 'Étretat',
  'Yvetot', 'Rouen', 'Vernon', 'Giverny', 'Les Andelys', 'Gaillon',
  'Port-en-Bessin', 'Arromanches-les-Bains', 'Omaha Beach', 'Utah Beach',
  
  // PAYS-DE-LA-LOIRE (44, 85)
  'La Baule-Escoublac', 'Pornic', 'Saint-Nazaire', 'Pornichet', 'Guérande', 'Le Pouliguen',
  'Saint-Brevin-les-Pins', 'Préfailles', 'Corsept', 'Saint-Michel-Chef-Chef',
  'Saint-Gilles-Croix-de-Vie', 'Île-de-Noirmoutier', 'Fromentine', 'Barbâtre',
  'Île-d\'Yeu', 'Saint-Clément-des-Baleines', 'Île-de-Ré', 'Saint-Martin-de-Ré',
  'Ars-en-Ré', 'Loix', 'Sainte-Marie-de-Ré', 'Saint-Clement-des-Baleines',
  'Talmont-Saint-Hilaire', 'Longeville-sur-Mer', 'Saint-Hilaire-de-Riez',
  'Notre-Dame-de-Monts', 'Bouin', 'Beauvoir-sur-Mer', 'Soullans',
  'Challans', 'Montaigu-Zichem', 'Ancenis-Saint-Géréon', 'Oudon',
  
  // NOUVELLE-AQUITAINE (17, 33, 40, 64)
  'La Rochelle', 'Arcachon', 'Hossegor', 'Soorts-Hossegor', 'Capbreton', 'Vieux-Boucau',
  'Messanges', 'Moliets-et-Maa', 'Léon', 'Seignosse', 'Anglet', 'Biarritz', 'Saint-Jean-de-Luz',
  'Hendaye', 'Guéthary', 'Bidart', 'Île-d\'Aix', 'Oléron', 'Saint-Georges-d\'Oléron',
  'Royan', 'Pontaillac', 'Marennes', 'Fouras', 'Angoulins', 'Châtelaillon-Plage',
  'Île-de-Ré', 'Ars-en-Ré', 'Loix', 'Sainte-Marie-de-Ré', 'Saintes', 'Tonnay-Charente',
  'Saint-Trojan-les-Bains', 'Dolus-d\'Oléron', 'Château-d\'Oléron', 'Boyardville',
  'Brouage', 'Ronce-les-Bains', 'Île-Madame', 'Aix-d\'Angély', 'Cognac', 'Jarnac',
  'Gascogne', 'Dax', 'Mont-de-Marsan', 'Bayonne', 'Orthez', 'Oloron-Sainte-Marie',
  'Tarbes', 'Pau', 'Lourdes', 'Cauterets', 'Barèges', 'Gavarnie',
  'Salies-de-Béarn', 'Sorde-l\'Abbaye', 'Habas', 'Escot',
  
  // LANGUEDOC-ROUSSILLON (34, 66, 11, 30)
  'Sète', 'Agde', 'Cap-d\'Agde', 'Valras-Plage', 'Bénodet', 'Talmont', 'Marseillan',
  'Mèze', 'Balaruc-les-Bains', 'Frontignan', 'Palavas-les-Flots', 'Montpellier',
  'Carnon-Plage', 'Grau-du-Roi', 'Port-Camargue', 'Saintes-Maries-de-la-Mer',
  'Arles', 'Camargue', 'Port-Saint-Louis-du-Rhône', 'Fos-sur-Mer',
  'Collioure', 'Port-Vendres', 'Banyuls-sur-Mer', 'Cerbère', 'Argelès-sur-Mer',
  'Saint-Cyprien', 'Canet-en-Roussillon', 'Leucate', 'Port-la-Nouvelle', 'Sigean',
  'La Franqui', 'Narbonne', 'Gruissan', 'Saint-Pierre-la-Mer', 'Vendres',
  'Lézignan-Corbières', 'Vingrau', 'Maury', 'Latour-de-France', 'Rivesaltes',
  
  // PACA (83, 06, 13, 04, 05)
  'Marseille', 'Cassis', 'La Ciotat', 'Toulon', 'Hyères', 'Porquerolles', 'Port-Cros',
  'Levant', 'Bormes-les-Mimosas', 'Le Lavandou', 'Rayol-Canadel-sur-Mer', 'Saint-Tropez',
  'Sainte-Maxime', 'Fréjus', 'Saint-Aygulf', 'Cannes', 'Antibes', 'Juan-les-Pins',
  'Vallauris', 'Golfe-Juan', 'Théoule-sur-Mer', 'Mandelieu-la-Napoule', 'Nice',
  'Villefranche-sur-Mer', 'Beaulieu-sur-Mer', 'Cap-d\'Ail', 'Roquebrune-Cap-Martin',
  'Menton', 'Sainte-Marguerite', 'Île-Sainte-Marguerite', 'Îles-de-Lérins',
  'Cagnes-sur-Mer', 'Vence', 'Grasse', 'Mougins', 'Le Cannet', 'Île-de-Porquerolles',
  'Île-de-Port-Cros', 'Îles-d\'Hyères', 'Le Pradet', 'Carqueiranne', 'Giens',
  'Londe-les-Maures', 'Maraix', 'Cavalaire-sur-Mer', 'La Môle', 'Gigaro',
  'Lacanau', 'Arcachon', 'Gujan-Mestras', 'Andernos-les-Bains', 'Lège-Cap-Ferret',
  'Canet-en-Roussillon', 'Vias', 'Sérignan', 'Valras-Plage', 'Bessan',
  
  // CORSE (20)
  'Bastia', 'Ajaccio', 'Propriano', 'Bonifacio', 'Solenzara', 'Aléria', 'Macinaggio',
  'Centuri', 'Calvi', 'Île-Rousse', 'Lumio', 'Nonza', 'Saint-Florent', 'Ghisonaccia',
  'Porto-Vecchio', 'Figari', 'Sartène', 'Levie', 'Corte', 'Corti', 'Vescovato',
  'Vizzavona', 'Ponte-Leccia', 'Balagne', 'Île-de-Cavallo', 'Îles-Lavezzi',
  'Plage de Arone', 'Scandola', 'Réserve Naturelle', 'Golfe de Porto', 'Capo di Feno',
  'Punta Rossa', 'Punta Nera', 'Îles-Sanguinaires', 'Punta di Campomoro',
  
  // CÔTE D'OPALE (62, 59)
  'Boulogne-sur-Mer', 'Étaples', 'Le Touquet-Paris-Plage', 'Hardelot-Plage', 'Montreuil',
  'Calais', 'Coquelles', 'Gravesend', 'Dunkerque', 'Malo-les-Bains', 'Zuydcoote',
  'Gravelines', 'Le Portel', 'Outreau', 'Wimereux', 'Wissant', 'Audresselles',
  'Ambleteuse', 'Tardinghen', 'Marquise', 'Staple', 'Cape Gris-Nez',
  'Westkapelle', 'Koksijde', 'De Panne', 'Knokke-Heist',
  
  // MÉDITERRANÉE - Complément (82, 83)
  'Saint-Tropez', 'Sainte-Maxime', 'Fréjus', 'Cannes', 'Antibes', 'Nice', 'Menton',
  'Toulon', 'Hyères', 'Île-de-Porquerolles', 'Bormes-les-Mimosas', 'Le Lavandou',
  'Villefranche-sur-Mer', 'Beaulieu-sur-Mer', 'Cap-Ferrat', 'Roquebrune-Cap-Martin',
  'Cassis', 'La Ciotat', 'Marseille', 'Carry-le-Rouet', 'Sausset-les-Pins',
  'Martigues', 'Port-de-Bouc', 'Istres', 'Salon-de-Provence',
  
  // AUTRES VILLES CÔTIÈRES (complément)
  'Berck-sur-Mer', 'Bagatelle', 'Oye-Plage', 'Quend-Plage', 'Fort-Mahon-Plage',
  'Cayeux-sur-Mer', 'Ault', 'Mers-les-Bains', 'Le Crotoy', 'Rue', 'Abbeville',
  'Saint-Valery-sur-Somme', 'Noyelles-sur-Mer', 'Monflières', 'Ailly-sur-Somme',
  'Amiens', 'Picardie', 'Normandie-Maritime', 'Pas-de-Calais', 'Nord',
];

// RECHERCHES CIBLÉES - UNIQUEMENT CLUBS DE VOILE
const SEARCH_QUERIES = [
  'club de voile',
  'école de voile',
  'centre nautique voile',
];

interface GooglePlacesResult {
  name: string;
  formatted_address: string;
  international_phone_number?: string;
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: { weekday_text?: string[] };
  photos?: Array<{ photo_reference: string }>;
  rating?: number;
  user_ratings_total?: number;
  place_id: string;
  geometry?: {
    location: { lat: number; lng: number };
  };
  types?: string[];
}

export async function scrapeAllCoastalClubs() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;
  if (!apiKey) throw new Error('Google Places API key missing');

  let totalScraped = 0;
  let totalSaved = 0;
  const errors: string[] = [];
  const savedClubs = new Set<string>();

  console.log(`🚀 Starting comprehensive sailing clubs scraper...`);
  console.log(`📍 Cities to scan: ${COASTAL_CITIES.length}`);
  console.log(`🔎 Search queries: ${SEARCH_QUERIES.length}`);

  for (const city of COASTAL_CITIES) {
    for (const query of SEARCH_QUERIES) {
      try {
        const searchQuery = `${query} ${city}`;
        console.log(`🔍 Searching: "${searchQuery}"`);

        const searchUrl = new URL('https://maps.googleapis.com/maps/api/place/textsearch/json');
        searchUrl.searchParams.append('query', searchQuery);
        searchUrl.searchParams.append('region', 'fr');
        searchUrl.searchParams.append('key', apiKey);

        const searchResponse = await fetch(searchUrl.toString());
        const searchData = await searchResponse.json();

        if (!searchData.results || searchData.results.length === 0) {
          continue;
        }

        for (const place of searchData.results) {
          const placeId = place.place_id;

          if (savedClubs.has(placeId)) continue;

          // Récupérer les détails complets
          const detailsUrl = new URL(
            'https://maps.googleapis.com/maps/api/place/details/json'
          );
          detailsUrl.searchParams.append('place_id', placeId);
          detailsUrl.searchParams.append('fields', [
            'name',
            'formatted_address',
            'formatted_phone_number',
            'international_phone_number',
            'website',
            'opening_hours',
            'photos',
            'rating',
            'user_ratings_total',
            'geometry',
            'type',
          ].join(','));
          detailsUrl.searchParams.append('key', apiKey);

          const detailsResponse = await fetch(detailsUrl.toString());
          const detailsData = await detailsResponse.json();

          if (detailsData.result) {
            const result: GooglePlacesResult = detailsData.result;
            totalScraped++;

            // Vérifier si le club existe déjà
            const { data: existing } = await supabase
              .from('clubs')
              .select('id')
              .eq('google_place_id', placeId)
              .maybeSingle();

            if (!existing) {
              // Récupérer les photos
              let photoUrls: string[] = [];
              if (result.photos && result.photos.length > 0) {
                photoUrls = result.photos.slice(0, 5).map(photo => {
                  const photoUrl = new URL(
                    'https://maps.googleapis.com/maps/api/place/photo'
                  );
                  photoUrl.searchParams.append('maxwidth', '800');
                  photoUrl.searchParams.append('photo_reference', photo.photo_reference);
                  photoUrl.searchParams.append('key', apiKey);
                  return photoUrl.toString();
                });
              }

              // Extraire adresse et ville
              const addressParts = (result.formatted_address || '').split(',');
              const address = addressParts[0]?.trim() || '';

              const clubData = {
                name: result.name,
                description: result.formatted_address || '',
                address: address,
                city: city,
                zip_code: extractZipCode(result.formatted_address),
                region: getRegionFromCity(city),
                phone: result.international_phone_number || result.formatted_phone_number || '',
                email: '',
                website: result.website || '',
                latitude: result.geometry?.location?.lat || 0,
                longitude: result.geometry?.location?.lng || 0,
                rating: result.rating || 0,
                review_count: result.user_ratings_total || 0,
                activities: ['Voilier'],
                schedule_open: result.opening_hours?.weekday_text?.join(' | ') || 'Horaires non disponibles',
                photos: photoUrls,
                google_place_id: placeId,
                is_premium: false,
                age_range: ['Enfants', 'Ados', 'Adultes'],
              };

              const { error } = await supabase
                .from('clubs')
                .insert([clubData]);

              if (!error) {
                totalSaved++;
                savedClubs.add(placeId);
                console.log(`✅ Saved: ${result.name} (${city})`);
              } else {
                errors.push(`Error saving ${result.name}: ${error.message}`);
              }
            }
          }

          // Rate limiting
          await new Promise(resolve => setTimeout(resolve, 250));
        }
      } catch (error) {
        errors.push(`Error processing ${city}: ${String(error)}`);
      }

      await new Promise(resolve => setTimeout(resolve, 400));
    }
  }

  console.log(`\n📊 ===== SCRAPING COMPLETE =====`);
  console.log(`✅ Total searched: ${totalScraped}`);
  console.log(`💾 Total saved: ${totalSaved}`);
  console.log(`⚠️  Errors: ${errors.length}`);
  if (errors.length > 0) {
    errors.slice(0, 5).forEach(e => console.log(`  - ${e}`));
  }

  return { totalScraped, totalSaved, errors };
}

function extractZipCode(address: string): string {
  const match = address?.match(/(\d{5})/);
  return match ? match[1] : '';
}

function getRegionFromCity(city: string): string {
  const regions: { [key: string]: string } = {
    // Bretagne
    'Brest': 'Bretagne', 'Vannes': 'Bretagne', 'Saint-Malo': 'Bretagne', 'Lorient': 'Bretagne',
    'Concarneau': 'Bretagne', 'Quiberon': 'Bretagne', 'Dinard': 'Bretagne', 'Roscoff': 'Bretagne',
    'Douarnenez': 'Bretagne', 'Audierne': 'Bretagne', 'Carnac': 'Bretagne', 'La Trinité-sur-Mer': 'Bretagne',
    'Arradon': 'Bretagne', 'Séné': 'Bretagne', 'Plouhinec': 'Bretagne', 'Guilvinec': 'Bretagne',
    'Paimpol': 'Bretagne', 'Perros-Guirec': 'Bretagne', 'Morlaix': 'Bretagne', 'Carantec': 'Bretagne',
    'Landéda': 'Bretagne', 'Plouarzel': 'Bretagne', 'Bénodet': 'Bretagne', 'Fouesnant': 'Bretagne',
    'Crozon': 'Bretagne', 'Camaret-sur-Mer': 'Bretagne', 'Morgat': 'Bretagne',
    
    // Normandie
    'Honfleur': 'Normandie', 'Deauville': 'Normandie', 'Cherbourg-en-Cotentin': 'Normandie',
    'Étretat': 'Normandie', 'Fécamp': 'Normandie', 'Dieppe': 'Normandie', 'Le Havre': 'Normandie',
    'Cabourg': 'Normandie', 'Ouistreham': 'Normandie', 'Courseulles-sur-Mer': 'Normandie',
    'Grandcamp-Maisy': 'Normandie', 'Isigny-sur-Mer': 'Normandie', 'Houlgate': 'Normandie',
    'Villers-sur-Mer': 'Normandie', 'Blonville-sur-Mer': 'Normandie', 'Saint-Adresse': 'Normandie',
    
    // Pays-de-la-Loire
    'La Baule-Escoublac': 'Pays de la Loire', 'Pornic': 'Pays de la Loire', 'Saint-Nazaire': 'Pays de la Loire',
    'Pornichet': 'Pays de la Loire', 'Guérande': 'Pays de la Loire', 'Le Pouliguen': 'Pays de la Loire',
    'Saint-Brevin-les-Pins': 'Pays de la Loire', 'Préfailles': 'Pays de la Loire', 'Noirmoutier': 'Pays de la Loire',
    'Saint-Gilles-Croix-de-Vie': 'Pays de la Loire', 'Talmont-Saint-Hilaire': 'Pays de la Loire',
    'Notre-Dame-de-Monts': 'Pays de la Loire',
    
    // Nouvelle-Aquitaine
    'La Rochelle': 'Nouvelle-Aquitaine', 'Arcachon': 'Nouvelle-Aquitaine', 'Hossegor': 'Nouvelle-Aquitaine',
    'Capbreton': 'Nouvelle-Aquitaine', 'Biarritz': 'Nouvelle-Aquitaine', 'Saint-Jean-de-Luz': 'Nouvelle-Aquitaine',
    'Hendaye': 'Nouvelle-Aquitaine', 'Anglet': 'Nouvelle-Aquitaine', 'Royan': 'Nouvelle-Aquitaine',
    'Marennes': 'Nouvelle-Aquitaine', 'Fouras': 'Nouvelle-Aquitaine', 'Angoulins': 'Nouvelle-Aquitaine',
    'Châtelaillon-Plage': 'Nouvelle-Aquitaine',
    
    // Languedoc-Roussillon
    'Sète': 'Languedoc-Roussillon', 'Agde': 'Languedoc-Roussillon', 'Montpellier': 'Languedoc-Roussillon',
    'Collioure': 'Languedoc-Roussillon', 'Banyuls-sur-Mer': 'Languedoc-Roussillon',
    'Argelès-sur-Mer': 'Languedoc-Roussillon', 'Leucate': 'Languedoc-Roussillon',
    'Port-la-Nouvelle': 'Languedoc-Roussillon', 'Gruissan': 'Languedoc-Roussillon',
    
    // PACA
    'Marseille': 'PACA', 'Toulon': 'PACA', 'Hyères': 'PACA', 'Nice': 'PACA', 'Cannes': 'PACA',
    'Antibes': 'PACA', 'Menton': 'PACA', 'Cassis': 'PACA', 'La Ciotat': 'PACA',
    'Fréjus': 'PACA', 'Saint-Tropez': 'PACA', 'Sainte-Maxime': 'PACA', 'Villefranche-sur-Mer': 'PACA',
    'Beaulieu-sur-Mer': 'PACA', 'Roquebrune-Cap-Martin': 'PACA', 'Bormes-les-Mimosas': 'PACA',
    'Le Lavandou': 'PACA', 'Juan-les-Pins': 'PACA', 'Golfe-Juan': 'PACA', 'Mandelieu-la-Napoule': 'PACA',
    'Théoule-sur-Mer': 'PACA', 'Cagnes-sur-Mer': 'PACA', 'Grasse': 'PACA', 'Mougins': 'PACA',
    
    // Corse
    'Bastia': 'Corse', 'Ajaccio': 'Corse', 'Propriano': 'Corse', 'Bonifacio': 'Corse',
    'Solenzara': 'Corse', 'Calvi': 'Corse', 'Île-Rousse': 'Corse', 'Saint-Florent': 'Corse',
    'Porto-Vecchio': 'Corse', 'Corte': 'Corse',
    
    // Côte d'Opale
    'Boulogne-sur-Mer': 'Côte d\'Opale', 'Calais': 'Côte d\'Opale', 'Dunkerque': 'Côte d\'Opale',
    'Le Touquet-Paris-Plage': 'Côte d\'Opale', 'Hardelot-Plage': 'Côte d\'Opale',
    'Étaples': 'Côte d\'Opale', 'Wimereux': 'Côte d\'Opale', 'Wissant': 'Côte d\'Opale',
  };

  return regions[city] || 'France';
}
