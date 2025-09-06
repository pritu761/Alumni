import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// JWT verification using Web Crypto API (Edge Runtime compatible)
async function verifyJWT(token: string, secret: string): Promise<Record<string, any>> {
  try {
    // Split the JWT token
    const [headerB64, payloadB64, signatureB64] = token.split('.');
    
    if (!headerB64 || !payloadB64 || !signatureB64) {
      throw new Error('Invalid JWT format');
    }

    // Decode the payload
    const payload = JSON.parse(atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/')));
    
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      throw new Error('Token expired');
    }

    // Create the signing input
    const signingInput = `${headerB64}.${payloadB64}`;
    
    // Convert secret to Uint8Array
    const encoder = new TextEncoder();
    const secretBytes = encoder.encode(secret);
    
    // Import the secret as a CryptoKey
    const key = await crypto.subtle.importKey(
      'raw',
      secretBytes,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign', 'verify']
    );
    
    // Create expected signature
    const signingInputBytes = encoder.encode(signingInput);
    const expectedSignatureBuffer = await crypto.subtle.sign('HMAC', key, signingInputBytes);
    const expectedSignature = btoa(String.fromCharCode(...new Uint8Array(expectedSignatureBuffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    // Compare signatures
    const providedSignature = signatureB64;
    
    if (expectedSignature !== providedSignature) {
      throw new Error('Invalid signature');
    }
    
    return payload;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`JWT verification failed: ${errorMessage}`);
  }
}

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

export async function middleware(request: NextRequest) {
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
      const decoded = await verifyJWT(token, process.env.JWT_SECRET || 'Hello World');
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
      const decoded = await verifyJWT(token, process.env.JWT_SECRET || 'Hello World');
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
      const decoded = await verifyJWT(token, process.env.JWT_SECRET || 'Hello World');
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
