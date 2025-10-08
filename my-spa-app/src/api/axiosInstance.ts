import axios from 'axios';
import { getAuthToken } from '../utils/storage'; // トークンを取得する関数

const baseURL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const instance = axios.create({
  baseURL,
});

// ✅ Interceptor を使って毎回 Authorization を自動設定
instance.interceptors.request.use(
  (config) => {
    const token = getAuthToken(); // localStorage からトークン取得
    if (token) {
      config.headers['Authorization'] = token;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
