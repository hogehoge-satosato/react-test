const AUTH_KEY = 'authHeader';

export const saveAuthToken = (token: string) => {
  localStorage.setItem(AUTH_KEY, token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_KEY);
};

export const removeAuthToken = () => {
  localStorage.removeItem(AUTH_KEY);
};