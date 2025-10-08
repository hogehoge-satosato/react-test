import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const { authToken, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const token = 'Basic ' + btoa(`${username.replace(/[\r\n]/g, '')}:${password.replace(/[\r\n]/g, '')}`);
    
    try {
      await api.get('/api/products', {
        headers: { Authorization: token },
      });

      login(token);
      navigate('/products');
    } catch {
      setError('認証に失敗しました。ユーザー名またはパスワードを確認してください。');
    } finally {
      setLoading(false);
    }
  };
  
  if (authToken) {
    return  <Navigate to="/products" replace />;
  }
  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: 'auto' }}>
      <h2>ログイン</h2>
      <div>
        <label>
          ユーザー名：
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
            required
          />
        </label>
      </div>
      <div style={{ marginTop: 8 }}>
        <label>
          パスワード：
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </label>
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
        {loading ? '認証中…' : 'ログイン'}
      </button>
    </form>
  );
};

export default Login;
