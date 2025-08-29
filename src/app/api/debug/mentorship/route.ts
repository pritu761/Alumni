import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    // Get token from cookie or Authorization header
    const cookies = request.headers.get('cookie') || '';
    const cookieMatch = cookies.match(/auth-token=([^;]+)/);
    const token = cookieMatch ? cookieMatch[1] : null;
    
    console.log('=== MENTORSHIP API TEST ===');
    console.log('Has token:', !!token);
    console.log('Token preview:', token?.substring(0, 20) + '...');
    console.log('Request URL:', request.url);
    console.log('Headers:', Object.fromEntries(request.headers.entries()));
    
    if (!token) {
      return NextResponse.json({
        error: 'No auth token found',
        hasToken: false,
        cookies: cookies,
        timestamp: new Date().toISOString()
      }, { status: 401 });
    }

    // Try to make a request to the actual mentorship API
    const mentorshipResponse = await fetch(new URL('/api/mentorship', request.url).toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Cookie': cookies
      }
    });

    const mentorshipData = await mentorshipResponse.json();

    return NextResponse.json({
      success: true,
      mentorshipApiStatus: mentorshipResponse.status,
      mentorshipData: mentorshipData,
      tokenUsed: token?.substring(0, 20) + '...',
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Server error',
      message: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
