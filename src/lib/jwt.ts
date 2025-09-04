// JWT verification using Web Crypto API (Edge Runtime compatible)
export async function verifyJWT(token: string, secret?: string): Promise<any> {
  try {
    const jwtSecret = secret || process.env.JWT_SECRET || 'Hello World';
    
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
    const secretBytes = encoder.encode(jwtSecret);
    
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
