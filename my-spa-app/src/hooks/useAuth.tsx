import React, { useEffect, createContext, useState, useContext, ReactNode }from 'react';
import { getAuthToken, saveAuthToken, removeAuthToken } from '../utils/storage';

interface AuthContextType {
  authToken: string | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const token = getAuthToken();
    setAuthToken(token);
    setLoading(false);
  }, []);

  const login = (token: string) => {
    saveAuthToken(token);
    setAuthToken(token);
  };

  const logout = () => {
    removeAuthToken();
    setAuthToken(null);
  };
  if (loading) return <div>Loading...</div>;
  return (
    <AuthContext.Provider value={{ authToken, login, logout, loading }} >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
