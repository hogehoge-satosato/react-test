import React, { useEffect, createContext, useState, useContext, ReactNode }from 'react';
import { setAuthHeader } from '../api/axiosInstance';
import { getAuthToken, saveAuthToken, removeAuthToken } from '../utils/storage';

interface AuthContextType {
  authToken: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setAuthHeader(token);
      setAuthToken(token);
    }
  }, []);

  const login = (token: string) => {
    saveAuthToken(token);
    setAuthHeader(token);
    setAuthToken(token);
  };

  const logout = () => {
    removeAuthToken();
    setAuthHeader(null);
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, login, logout }} >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
