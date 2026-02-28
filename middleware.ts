import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const path = req.nextUrl.pathname;

    // If the user is logged in and tries to access login or signup, redirect them to their profile
    if (token && (path === '/auth/login' || path === '/auth/signup')) {
        return NextResponse.redirect(new URL('/profile', req.url));
    }

    // If the user is NOT logged in and tries to access protected routes, redirect to login
    const protectedRoutes = ['/profile', '/providers'];
    if (!token && protectedRoutes.some((route) => path.startsWith(route))) {
        return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/auth/login',
        '/auth/signup',
        '/profile/:path*',
        '/providers/:path*',
    ],
};
