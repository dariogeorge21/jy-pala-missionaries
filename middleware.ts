import { NextRequest, NextResponse } from 'next/server';

const PROTECTED_PATHS = ['/dashboard'];
const AUTH_COOKIE = 'jyp_auth';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));

  if (isProtected) {
    const token = request.cookies.get(AUTH_COOKIE);
    if (!token || token.value !== 'authenticated') {
      const loginUrl = new URL('/', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
