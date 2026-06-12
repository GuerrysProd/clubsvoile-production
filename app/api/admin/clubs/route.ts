import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getJwtSecret } from '@/lib/adminAuth';
import jwt from 'jsonwebtoken';

function verifyToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) return null;

  try {
    return jwt.verify(token, getJwtSecret());
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const PAGE_SIZE = 1000;
    const clubs: any[] = [];
    let total = 0;
    for (let from = 0; ; from += PAGE_SIZE) {
      const { data, count, error } = await supabase
        .from('clubs')
        .select('*', { count: 'exact' })
        .order('name', { ascending: true })
        .range(from, from + PAGE_SIZE - 1);

      if (error) throw error;

      clubs.push(...(data || []));
      total = count || 0;
      if (!data || data.length < PAGE_SIZE || clubs.length >= total) break;
    }

    return NextResponse.json({ clubs, total });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
