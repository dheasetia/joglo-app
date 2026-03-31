import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse } from '../types';
import api from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: AuthResponse, rememberMe?: boolean) => void;
  logout: () => void;
  refreshUser: (updatedUser: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const TOKEN_KEY = 'token';
  const USER_KEY = 'user';
  const REMEMBER_UNTIL_KEY = 'rememberUntil';
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const rememberUntil = localStorage.getItem(REMEMBER_UNTIL_KEY);
    const isRememberedSessionValid = rememberUntil ? Number(rememberUntil) > Date.now() : false;

    if (rememberUntil && !isRememberedSessionValid) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(REMEMBER_UNTIL_KEY);
    }

    const storedToken = isRememberedSessionValid
      ? localStorage.getItem(TOKEN_KEY)
      : sessionStorage.getItem(TOKEN_KEY);
    const storedUser = isRememberedSessionValid
      ? localStorage.getItem(USER_KEY)
      : sessionStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (data: AuthResponse, rememberMe = false) => {
    setToken(data.access_token);
    setUser(data.user);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REMEMBER_UNTIL_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);

    if (rememberMe) {
      const rememberUntil = Date.now() + 7 * 24 * 60 * 60 * 1000;
      localStorage.setItem(TOKEN_KEY, data.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      localStorage.setItem(REMEMBER_UNTIL_KEY, String(rememberUntil));
      return;
    }

    sessionStorage.setItem(TOKEN_KEY, data.access_token);
    sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REMEMBER_UNTIL_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
  };

  const refreshUser = (updatedUser: User) => {
    setUser(updatedUser);

    const rememberUntil = localStorage.getItem(REMEMBER_UNTIL_KEY);
    const isRememberedSessionValid = rememberUntil ? Number(rememberUntil) > Date.now() : false;

    if (isRememberedSessionValid) {
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      return;
    }

    sessionStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, refreshUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
