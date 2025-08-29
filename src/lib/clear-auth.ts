// Clear all authentication tokens and force fresh login
export function clearAuthState() {
  if (typeof window !== 'undefined') {
    // Clear localStorage
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-user');
    
    // Clear auth cookie
    document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    console.log('Auth state cleared. Please login again.');
    
    // Redirect to login
    window.location.href = '/auth/login';
  }
}

// Call this function if you're getting "Invalid token" errors
// clearAuthState();
