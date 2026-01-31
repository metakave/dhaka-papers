import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth-token')?.value;
    const isLoginPage = request.nextUrl.pathname.startsWith('/login');

    // If trying to access login page while authenticated, redirect to dashboard
    if (isLoginPage && token) {
        return NextResponse.redirect(new URL('/admin', request.url));
    }

    // If trying to access protected routes (everything except login and public assets)
    // while NOT authenticated, redirect to login
    if (!isLoginPage && !token) {
        // Exclude static files, images, etc.
        if (!request.nextUrl.pathname.match(/\.(.*)$/)) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
