import axios from 'axios';

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const instance = axios.create({
  baseURL,
});

export const setAuthHeader = (token: string | null) => {
  if (token) {
    instance.defaults.headers.common['Authorization'] = token;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
};

export default instance;