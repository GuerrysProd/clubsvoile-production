import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, count } = await supabase
      .from('clubs')
      .select('*', { count: 'exact' })
      .limit(1000);

    return NextResponse.json({ clubs: data || [], total: count || 0 });
  } catch (error) {
    return NextResponse.json({ clubs: [], total: 0 }, { status: 500 });
  }
}
