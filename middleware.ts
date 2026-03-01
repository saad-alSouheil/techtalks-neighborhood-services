import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    const path = req.nextUrl.pathname;

    let isTokenValid = false;
    if (token) {
        try {
            const secret = new TextEncoder().encode(process.env.JWT_SECRET || '');
            await jwtVerify(token, secret);
            isTokenValid = true;
        } catch (error) {
            console.error('Invalid or expired token in middleware:', error);
            isTokenValid = false;
        }
    }

    // If the user is logged in and tries to access login or signup, redirect them to their profile
    if (isTokenValid && (path === '/auth/login' || path === '/auth/signup')) {
        return NextResponse.redirect(new URL('/profile', req.url));
    }

    // If the user is NOT logged in legitimately and tries to access protected routes, redirect to login
    const protectedRoutes = ['/profile', '/providers'];
    if (!isTokenValid && protectedRoutes.some((route) => path.startsWith(route))) {
        const response = NextResponse.redirect(new URL('/auth/login', req.url));
        // Optional: clear the fake/expired cookie
        if (token && !isTokenValid) {
            response.cookies.delete('token');
        }
        return response;
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
