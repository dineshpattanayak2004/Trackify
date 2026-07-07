const API_BASE = import.meta.env.PROD 
  ? `${window.location.origin}/api`
  : (import.meta.env.VITE_API_URL || 'http://localhost:4000');

export const API_BASE_URL = API_BASE;

export async function apiRequest(method, path, data = null, token = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const url = `${API_BASE}${path}`;
    console.log(`[API] ${method} ${url}`);
    
    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[API] ${method} ${path} -> ${response.status}: ${errorText}`);
      return { error: true, status: response.status, message: errorText };
    }

    const result = await response.json();
    return { error: false, data: result };
  } catch (err) {
    console.warn(`[API] Network error: ${path}`, err.message);
    return { error: true, status: 0, message: err.message };
  }
}