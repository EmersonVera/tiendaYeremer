import { createContext, useContext, useEffect, useState } from 'react';
import client, { clearTokens, getAccessToken, setTokens } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      setUser({ username: localStorage.getItem('tienda_yeremer_user') });
    }
    setLoading(false);
  }, []);

  async function login({ username, password }) {
    const { data } = await client.post('/auth/login/', { username, password });
    setTokens({ access: data.access, refresh: data.refresh });
    localStorage.setItem('tienda_yeremer_user', username);
    setUser({ username });
  }

  function logout() {
    clearTokens();
    localStorage.removeItem('tienda_yeremer_user');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
