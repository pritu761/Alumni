import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Protected routes that require authentication
const protectedRoutes = [
  '/admin',
  '/alumni/create',
  '/events/create',
  '/mentorship/request',
  '/donations/donate'
];

// API routes that require authentication
const protectedApiRoutes = [
  '/api/alumni',
  '/api/events/create',
  '/api/events/rsvp',
  '/api/mentorship',
  '/api/donations'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;
  
  // Check if this is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isProtectedApiRoute = protectedApiRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Special handling for events API - allow GET requests, protect others
  if (pathname.startsWith('/api/events') && !pathname.startsWith('/api/events/rsvp') && !pathname.startsWith('/api/events/create')) {
    if (method === 'GET') {
      // Allow GET requests to view events without authentication
      return NextResponse.next();
    }
    // Protect POST, PUT, DELETE requests
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Hello World');
      console.log('Events API - Token verified for:', decoded);
      return NextResponse.next();
    } catch (error) {
      console.error('Events API - JWT verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  }

  // Special handling for alumni API - allow GET requests, protect others  
  if (pathname.startsWith('/api/alumni') && !pathname.startsWith('/api/alumni/create')) {
    if (method === 'GET') {
      // Allow GET requests to view alumni without authentication
      return NextResponse.next();
    }
    // Protect POST, PUT, DELETE requests
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Hello World');
      console.log('Alumni API - Token verified for:', decoded);
      return NextResponse.next();
    } catch (error) {
      console.error('Alumni API - JWT verification failed:', error);
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  }

  if (isProtectedRoute || isProtectedApiRoute) {
    // Get token from cookie or Authorization header
    const token = request.cookies.get('auth-token')?.value || 
                  request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      // Redirect to login for protected pages
      if (isProtectedRoute) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      // Return 401 for API routes
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Hello World');
      console.log('Token verified successfully for:', decoded);
      // Token is valid, continue to the route
      return NextResponse.next();
    } catch (error) {
      console.error('JWT verification failed:', error);
      console.error('Token was:', token?.substring(0, 20) + '...');
      console.error('JWT Secret:', process.env.JWT_SECRET);
      
      // Invalid token
      if (isProtectedRoute) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }
      
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/alumni/create/:path*',
    '/events/create/:path*',
    '/mentorship/request/:path*',
    '/donations/donate/:path*',
    '/api/alumni/:path*',
    '/api/events/create/:path*',
    '/api/events/rsvp/:path*',
    '/api/mentorship/:path*',
    '/api/donations/:path*'
  ]
};
