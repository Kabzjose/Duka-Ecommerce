'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import type { User } from '@/lib/types';

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; phone: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On first load, try silently refreshing using the httpOnly cookie —
  // this is what keeps someone logged in across a page refresh or new tab
  useEffect(() => {
    async function tryRefresh() {
      try {
        const res = await api.post<{ accessToken: string }>('/auth/refresh');
        setAccessToken(res.accessToken);
        // We don't get the user object back from /refresh, so decode minimal info isn't
        // available client-side — real user profile will be fetched once /auth/me exists.
        // For now, mark as logged in; pages needing user details refetch as needed.
      } catch {
        // No valid refresh cookie — user is simply not logged in, not an error to surface
      } finally {
        setIsLoading(false);
      }
    }
    tryRefresh();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<{ user: User; accessToken: string }>('/auth/login', { email, password });
    setUser(res.user);
    setAccessToken(res.accessToken);
  }, []);

  const register = useCallback(
    async (data: { name: string; email: string; phone: string; password: string }) => {
      const res = await api.post<{ user: User; accessToken: string }>('/auth/register', data);
      setUser(res.user);
      setAccessToken(res.accessToken);
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // even if the server call fails, clear local state so the UI reflects logged-out immediately
    }
    setUser(null);
    setAccessToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
