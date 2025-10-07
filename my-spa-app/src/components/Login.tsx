import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const token = 'Basic ' + btoa(`${username}:${password}`);

    try {
      await api.get('/api/products', {
        headers: { Authorization: token },
      });

      login(token); // ← ここでuseAuthのlogin関数を呼び認証情報をセットする
      navigate('/products');
    } catch {
      setError('認証に失敗しました。ユーザー名またはパスワードを確認してください。');
    } finally {
      setLoading(false);
    }
  };

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
