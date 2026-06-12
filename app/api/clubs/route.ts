export const dynamic = 'force-dynamic';

import { supabase } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const region = searchParams.get('region');
    const activity = searchParams.get('activity');
    const city = searchParams.get('city');

    let query = supabase.from('clubs').select('*', { count: 'exact' });

    if (region) query = query.eq('region', region);
    if (activity) query = query.contains('activities', [activity]);
    if (city) query = query.ilike('city', `%${city}%`);

    const { data, error, count } = await query.limit(100);

    if (error) throw error;

    return NextResponse.json({ clubs: data, total: count });
  } catch (error) {
    console.error('Error fetching clubs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clubs' },
      { status: 500 }
    );
  }
}
