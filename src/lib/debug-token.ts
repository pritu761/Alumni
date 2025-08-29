import jwt from 'jsonwebtoken';

export function debugToken(token: string) {
  console.log('=== TOKEN DEBUG ===');
  console.log('Token length:', token?.length);
  console.log('Token starts with:', token?.substring(0, 20));
  console.log('JWT Secret:', process.env.JWT_SECRET);
  
  if (!token) {
    console.log('ERROR: No token provided');
    return false;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Hello World');
    console.log('Token decoded successfully:', decoded);
    return true;
  } catch (error) {
    console.log('Token verification failed:', error);
    
    // Try to decode without verification to see structure
    try {
      const payload = jwt.decode(token);
      console.log('Token payload (unverified):', payload);
    } catch (decodeError) {
      console.log('Failed to decode token:', decodeError);
    }
    
    return false;
  }
}
