// lib/types.ts
export interface Club {
  id: string;
  name: string;
  region: string;          // Bretagne, PACA, etc.
  department: string;       // 75, 13, etc.
  city: string;
  address: string;
  zipCode: string;
  phone: string;
  email: string;
  website?: string;
  googleMapsUrl?: string;
  logo?: string;
  description?: string;
  activities: string[];    // ["Dériveur", "Catamaran", "Planche à voile"]
  ageRange?: string[];      // ["Enfants", "Ados", "Adultes"]
  scheduleOpen?: string;    // Horaires d'ouverture
  latitude?: number;
  longitude?: number;
  rating?: number;
  reviewCount?: number;
  path?: string;
  createdAt: Date;
  updated?: Date;
}

export interface SearchFilters {
  region?: string;
  department?: string;
  city?: string;
  activity?: string;
  searchTerm?: string;
}
