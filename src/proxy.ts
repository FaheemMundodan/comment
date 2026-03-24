import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const sessionCookie = request.cookies.get('session');
    const { pathname } = request.nextUrl;

    // Protected paths
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) {
        if (!sessionCookie) {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    // If going to login page but already logged in
    if (pathname === '/') {
        if (sessionCookie) {
            return NextResponse.redirect(new URL('/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/dashboard', '/admin/:path*'],
};
