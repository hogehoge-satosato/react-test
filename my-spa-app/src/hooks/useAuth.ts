import { useState, useEffect } from 'react';
import { setAuthHeader } from '../api/axiosInstance';
import { getAuthToken, saveAuthToken, removeAuthToken } from '../utils/storage';

export const useAuth = () => {
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

  return { authToken, login, logout };
};
