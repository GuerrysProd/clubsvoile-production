import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin, getJwtSecret } from '@/lib/adminAuth';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const adminId = await verifyAdmin(username, password);
    if (!adminId) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { adminId, username },
      getJwtSecret(),
      { expiresIn: '7d' }
    );

    return NextResponse.json({ token });
  } catch (error) {
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    );
  }
}
