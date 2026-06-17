import axios from 'axios';

// Trade-off: tokens en localStorage por simplicidad (dos cuentas fijas, sin registro
// público); en una app con más superficie de ataque convendría httpOnly cookies.
const ACCESS_KEY = 'tienda_yeremer_access';
const REFRESH_KEY = 'tienda_yeremer_refresh';

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY);
}

export function setTokens({ access, refresh }) {
  localStorage.setItem(ACCESS_KEY, access);
  if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

client.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise = null;

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    if (response?.status !== 401 || config._retried) {
      throw error;
    }

    const refresh = getRefreshToken();
    if (!refresh) {
      clearTokens();
      window.location.href = '/login';
      throw error;
    }

    try {
      refreshPromise ??= axios
        .post(`${import.meta.env.VITE_API_URL}/auth/refresh/`, { refresh })
        .finally(() => {
          refreshPromise = null;
        });
      const { data } = await refreshPromise;
      setTokens({ access: data.access });
      config._retried = true;
      config.headers.Authorization = `Bearer ${data.access}`;
      return client(config);
    } catch (refreshError) {
      clearTokens();
      window.location.href = '/login';
      throw refreshError;
    }
  }
);

export default client;
