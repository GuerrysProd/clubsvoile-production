import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import jwt from 'jsonwebtoken';

function verifyToken(request: NextRequest) {
  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) return null;
  
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET || 'secret');
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  if (!verifyToken(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .limit(500);

    if (error) throw error;

    return NextResponse.json({ clubs: data });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
