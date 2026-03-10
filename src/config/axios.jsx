import axios from 'axios';

/**
 * Axios instance for TinyLearn frontend.
 * Make sure VITE_API_BASE_URL is set in your .env file,
 * otherwise it falls back to http://localhost:8000/api
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// The auth token is an HttpOnly cookie set by the server on login.
// withCredentials: true (above) tells the browser to include it automatically.
// No manual Authorization header is needed or possible for HttpOnly cookies.

export default api;

