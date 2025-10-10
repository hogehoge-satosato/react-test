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
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>ログイン</h2>

        <div style={styles.field}>
          <label style={styles.label}>ユーザー名</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            disabled={loading}
            required
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            disabled={loading}
            required
            style={styles.input}
          />
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? '認証中…' : 'ログイン'}
        </button>
      </form>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#1e2a38', // 紺色背景
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '2.5rem',
    borderRadius: '12px',
    boxShadow: '0 6px 24px rgba(0,0,0,0.15)',
    width: '100%',
    maxWidth: '400px',
    boxSizing: 'border-box',
  },
  title: {
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#1e2a38', // 紺
    fontSize: '1.8rem',
    fontWeight: 'bold',
  },
  field: {
    marginBottom: '1.2rem',
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#333',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    boxSizing: 'border-box',
    outlineColor: '#2eccb7ff', // エメラルドグリーンでフォーカス時の枠
  },
  button: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#2eccb7ff', // エメラルドグリーン
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  error: {
    color: '#e74c3c',
    backgroundColor: '#fdecea',
    padding: '0.5rem',
    borderRadius: '6px',
    marginBottom: '1rem',
    fontSize: '0.9rem',
  },
};

export default Login;