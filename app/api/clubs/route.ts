// app/api/clubs/route.ts
import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const city = searchParams.get('city');
    const activity = searchParams.get('activity');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('clubs')
      .select('*', { count: 'exact' });

    if (region && region !== '') query = query.eq('region', region);
    if (city && city !== '') query = query.ilike('city', `%${city}%`);
    if (search && search !== '') {
      query = query.or(
        `name.ilike.%${search}%,description.ilike.%${search}%,city.ilike.%${search}%`
      );
    }
    if (activity && activity !== '') {
      query = query.contains('activities', [activity]);
    }

    const { data, error, count } = await query
      .order('rating', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    return NextResponse.json({
      clubs: data || [],
      total: count || 0,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch clubs',
      details: String(error)
    }, { status: 500 });
  }
}
