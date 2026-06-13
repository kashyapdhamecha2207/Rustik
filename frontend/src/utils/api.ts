const BASE_URL = 'http://localhost:5001/api';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('rustik_token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // Session expired
    localStorage.removeItem('rustik_user');
    localStorage.removeItem('rustik_token');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login?expired=true';
    }
  }

  return response;
};
