import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data } = await supabase.from('clubs').select('*').limit(1000);
    return NextResponse.json({ clubs: data || [] });
  } catch (error) {
    return NextResponse.json({ clubs: [] }, { status: 500 });
  }
}
