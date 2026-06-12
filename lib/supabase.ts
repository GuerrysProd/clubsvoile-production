// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour Supabase
export type Club = {
  id: string;
  name: string;
  description: string;
  region: string;
  department: string;
  city: string;
  address: string;
  zip_code: string;
  phone: string;
  email: string;
  website: string;
  google_maps_url: string;
  latitude: number;
  longitude: number;
  activities: string[];
  age_range: string[];
  schedule_open: string;
  logo_url: string;
  photos: string[];
  rating: number;
  review_count: number;
  is_premium: boolean;
  google_place_id: string;
  created_at: string;
  updated_at: string;
};

export type Review = {
  id: string;
  club_id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type User = {
  id: string;
  email: string;
  club_id: string;
  is_admin: boolean;
  created_at: string;
};
