import { NextResponse } from 'next/server';
import { sessionCookieName } from '@/lib/session';

export async function POST() {
  const response = NextResponse.json({ message: '已退出' });
  response.cookies.set(sessionCookieName, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
    path: '/',
    maxAge: 0
  });
  return response;
}
