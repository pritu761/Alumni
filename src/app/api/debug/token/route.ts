import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    // Get token from cookie or Authorization header
    const cookies = request.headers.get('cookie') || '';
    const cookieMatch = cookies.match(/auth-token=([^;]+)/);
    const cookieToken = cookieMatch ? cookieMatch[1] : null;
    
    const authHeader = request.headers.get('Authorization');
    const headerToken = authHeader?.replace('Bearer ', '');
    
    const token = cookieToken || headerToken;
    
    const response = {
      hasCookie: !!cookieToken,
      hasAuthHeader: !!headerToken,
      tokenSource: cookieToken ? 'cookie' : headerToken ? 'header' : 'none',
      tokenLength: token?.length || 0,
      tokenPreview: token?.substring(0, 20) + '...',
      jwtSecret: process.env.JWT_SECRET,
      timestamp: new Date().toISOString()
    };

    if (!token) {
      return NextResponse.json({
        ...response,
        error: 'No token found',
        valid: false
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Hello World');
      return NextResponse.json({
        ...response,
        valid: true,
        decoded: decoded,
        message: 'Token is valid'
      });
    } catch (jwtError: any) {
      return NextResponse.json({
        ...response,
        valid: false,
        error: 'Invalid token',
        jwtError: jwtError.message,
        errorType: jwtError.name
      });
    }

  } catch (error: any) {
    return NextResponse.json({
      error: 'Server error',
      message: error.message
    }, { status: 500 });
  }
}
