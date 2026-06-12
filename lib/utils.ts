// lib/utils.ts
import { Club, SearchFilters } from './types';

export function filterClubs(clubs: Club[], filters: SearchFilters): Club[] {
  return clubs.filter((club) => {
    // Filtre par région
    if (filters.region && club.region !== filters.region) {
      return false;
    }

    // Filtre par département
    if (filters.department && club.department !== filters.department) {
      return false;
    }

    // Filtre par ville
    if (filters.city && !club.city.toLowerCase().includes(filters.city.toLowerCase())) {
      return false;
    }

    // Filtre par activité
    if (filters.activity && !club.activities.includes(filters.activity)) {
      return false;
    }

    // Filtre par terme de recherche
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      const matches =
        club.name.toLowerCase().includes(term) ||
        club.city.toLowerCase().includes(term) ||
        club.description?.toLowerCase().includes(term);
      if (!matches) return false;
    }

    return true;
  });
}

export function getUniqueRegions(clubs: Club[]): string[] {
  return [...new Set(clubs.map((c) => c.region))].sort();
}

export function getUniqueDepartments(clubs: Club[], region?: string): string[] {
  let filtered = clubs;
  if (region) {
    filtered = clubs.filter((c) => c.region === region);
  }
  return [...new Set(filtered.map((c) => c.department))].sort();
}

export function getUniqueCities(clubs: Club[], region?: string, department?: string): string[] {
  let filtered = clubs;
  if (region) {
    filtered = filtered.filter((c) => c.region === region);
  }
  if (department) {
    filtered = filtered.filter((c) => c.department === department);
  }
  return [...new Set(filtered.map((c) => c.city))].sort();
}
