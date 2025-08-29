// Authenticated fetcher for SWR that includes JWT token
export const authenticatedFetcher = async (url: string) => {
  // Get token from cookie
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
  };

  const token = getCookie('auth-token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    headers,
    credentials: 'include', // Include cookies
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

// Regular fetcher for public endpoints
export const publicFetcher = (url: string) => fetch(url).then(res => res.json());
