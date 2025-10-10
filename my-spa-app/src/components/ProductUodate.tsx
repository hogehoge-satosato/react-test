import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';

const ProductUpdate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { authToken, logout, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (!authToken || !id) return;

    const fetchProduct = async () => {
      try {
        setErrors({});
        const response = await api.get(`/api/products/${id}`);
        const product = response.data;
        setName(product.name);
        setPrice(product.price);
        setStock(product.stock);
        setDescription(product.description);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError('認証エラー。再ログインしてください。');
          logout();
        } else {
          setError('商品の取得に失敗しました。');
        }
      }
    };

    fetchProduct();
  }, [authToken, id, logout]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken || !id) {
      setError('認証されていません。');
      return;
    }

    try {
      await api.put(
        `/api/products/${id}`,
        { name, price, stock, description }
      );
      navigate('/products');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('認証エラー。再ログインしてください。');
        logout();
      } else if (err.response?.status === 400) {
          setErrors(err.response.data);
      }  else {
        setError('商品の更新に失敗しました。');
      }
    }
  };

  if (loading) {
    return <p>読み込み中...</p>;
  }
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>✏️ 商品更新</h2>
        {error && <p style={{ ...styles.text, color: theme.error }}>{error}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>名前</label>
            <input
              style={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {errors.name && <p style={styles.errorText}>{errors.name}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>価格</label>
            <input
              style={styles.input}
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
            />
            {errors.price && <p style={styles.errorText}>{errors.price}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>在庫</label>
            <input
              style={styles.input}
              type="number"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
            />
            {errors.stock && <p style={styles.errorText}>{errors.stock}</p>}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>説明</label>
            <input
              style={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button type="submit" style={styles.submitButton}>更新</button>
            <button type="button" style={styles.cancelButton} onClick={() => navigate('/products')}>
              戻る
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const theme = {
  background: '#1e2a38',
  card: '#27394e',
  accent: '#2eccb7',
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
    boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: theme.accent,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '0.3rem',
    fontWeight: 'bold',
  },
  input: {
    padding: '0.6rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
  submitButton: {
    backgroundColor: theme.accent,
    color: theme.background,
    border: 'none',
    padding: '0.7rem 1.4rem',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    flex: 1,
    marginRight: '0.5rem',
  },
  cancelButton: {
    backgroundColor: '#ccc',
    color: '#000',
    border: 'none',
    padding: '0.7rem 1.4rem',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    flex: 1,
    marginLeft: '0.5rem',
  },
  errorText: {
    color: theme.error,
    fontSize: '0.85rem',
    marginTop: '0.2rem',
  },
  text: {
    fontSize: '1rem',
    textAlign: 'center',
    marginTop: '2rem',
  },
};

export default ProductUpdate;
