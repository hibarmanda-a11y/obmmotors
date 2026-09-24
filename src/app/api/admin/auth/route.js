import { NextResponse } from 'next/server';

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
      // Delay against brute force
      await new Promise((r) => setTimeout(r, 800));
      return NextResponse.json({ error: 'Access denied' }, { status: 401 });
    }

    // ✅ Cookie value = hash(password)
    const sessionHash = await hashPassword(password);

    const response = NextResponse.json({ success: true });
    response.cookies.set('admin_session', sessionHash, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Admin auth error:', error);
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  
  // ✅ Cookie delete — multiple paths e
  response.cookies.set('admin_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  
  // ✅ Extra safety — delete method
  response.cookies.delete('admin_session');

  return response;
}