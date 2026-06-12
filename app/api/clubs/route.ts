import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, count } = await supabase
      .from('clubs')
      .select(`
        id,
        name,
        city,
        region,
        department,
        address,
        zip_code,
        phone,
        email,
        website,
        google_maps_url,
        logo,
        description,
        activities
      `)
      .limit(1300);

    const clubs = (data || []).map((c) => ({
      id: c.id,
      name: c.name,
      city: c.city,
      region: c.region,
      department: c.department,
      address: c.address,
      zipCode: c.zip_code,
      phone: c.phone,
      email: c.email,
      website: c.website,
      googleMapsUrl: c.google_maps_url,
      logo: c.logo,
      description: c.description,
      activities: c.activities || [],
    }));

    return NextResponse.json({ clubs, total: count || 0 });
  } catch (error) {
    return NextResponse.json({ clubs: [], total: 0 }, { status: 500 });
  }
}