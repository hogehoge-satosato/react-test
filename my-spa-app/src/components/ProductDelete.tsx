import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';

const ProductDelete: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { authToken, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  
  const handleDelete = async () => {
    if (!authToken || !id) {
      setError('認証されていません。');
      return;
    }

    try {
      await api.delete(`/api/products/${id}`);
      navigate('/products');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('認証エラー。再ログインしてください。');
        logout();
      } else {
        setError('商品の削除に失敗しました。');
      }
    }
  };
  if (loading) {
    return <p>読み込み中...</p>;
  }
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🗑 商品削除</h2>
        {error && <p style={{ ...styles.text, color: theme.error }}>{error}</p>}
        <p style={styles.text}>本当に商品 ID <strong>{id}</strong> を削除しますか？</p>
        <div style={styles.buttonGroup}>
          <button style={styles.deleteButton} onClick={handleDelete}>削除する</button>
          <button style={styles.cancelButton} onClick={() => navigate('/products')}>キャンセル</button>
        </div>
      </div>
    </div>
  );
};

const theme = {
  background: '#1e2a38',
  card: '#27394e',
  accent: '#2eccb7',
  danger: '#e74c3c',
  text: '#ffffff',
  error: '#ff6b6b',
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    backgroundColor: theme.background,
    color: theme.text,
    minHeight: '100vh',
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: 'sans-serif',
  },
  card: {
    backgroundColor: theme.card,
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
    width: '100%',
    maxWidth: '500px',
    textAlign: 'center' as const,
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    color: theme.accent,
  },
  text: {
    fontSize: '1.1rem',
    marginBottom: '1.5rem',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem',
  },
  deleteButton: {
    backgroundColor: theme.danger,
    color: '#fff',
    border: 'none',
    padding: '0.7rem 1.4rem',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  cancelButton: {
    backgroundColor: theme.accent,
    color: theme.background,
    border: 'none',
    padding: '0.7rem 1.4rem',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
  },
};

export default ProductDelete;
