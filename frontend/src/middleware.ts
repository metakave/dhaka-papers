import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['bn', 'en'];
const defaultLocale = 'bn';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // Skip all internal paths (_next), API, and public files
  if (
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname === '/favicon.ico'
  ) {
    return;
  }

  const isEnSubdomain = host.startsWith('en.');
  const locale = isEnSubdomain ? 'en' : 'bn';

  // 1. Handle Legacy Path-Based Locales (Redirect to Subdomain)
  // Redirect /en/pathname to en.dhakapapers.com/pathname
  if (pathname.startsWith('/en/') || pathname === '/en') {
    const newPathname = pathname === '/en' ? '/' : pathname.replace('/en/', '/');
    const url = new URL(newPathname, request.url);
    url.host = host.includes('localhost') ? `en.${host.replace('en.', '')}` : `en.dhakapapers.com`;
    return NextResponse.redirect(url);
  }

  // Redirect /bn/pathname to dhakapapers.com/pathname (root)
  if (pathname.startsWith('/bn/') || pathname === '/bn') {
    const newPathname = pathname === '/bn' ? '/' : pathname.replace('/bn/', '/');
    const url = new URL(newPathname, request.url);
    url.host = host.replace('en.', ''); // Go to root domain
    return NextResponse.redirect(url);
  }

  // 2. Perform Internal Rewrite to the Locale-Specific Route
  // This allows the use of [locale] folder structure without showing it in the URL
  return NextResponse.rewrite(
    new URL(`/${locale}${pathname}`, request.url)
  );
}

export const config = {
  matcher: [
    // Skip all internal paths (_next)
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
