import { NextRequest, NextResponse } from 'next/server';
import { sessionCookieName, verifySession } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(sessionCookieName)?.value;
  const { pathname } = request.nextUrl;
  const isProtected =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/api/upload');
  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      await verifySession(token);
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.set(sessionCookieName, '', {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 0
      });
      return response;
    }
  }

  if (isAuthPage && token) {
    try {
      await verifySession(token);
      return NextResponse.redirect(new URL('/admin', request.url));
    } catch {
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/dashboard/:path*', '/login', '/register', '/api/upload']
};
