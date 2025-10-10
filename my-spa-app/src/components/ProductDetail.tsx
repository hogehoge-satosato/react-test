import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { authToken, logout, loading } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [loadingThis, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authToken || loading) return;
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get<Product>(`/api/products/${id}`);
        setProduct(response.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          setError('認証エラー。再ログインしてください。');
          logout();
        } else {
          setError('商品情報の取得に失敗しました。');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [authToken, id, logout, loading]);

  if (loadingThis || loading) return <p>読み込み中...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!product) return <p>商品が見つかりません。</p>;

return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>🛍 商品詳細</h2>
        <p><strong>ID:</strong> {product.id}</p>
        <p><strong>名前:</strong> {product.name}</p>
        <p><strong>価格:</strong> ￥{product.price.toLocaleString()}</p>
        <p><strong>在庫:</strong> {product.stock}</p>
        <p><strong>説明:</strong> {product.description || 'なし'}</p>
        <button style={styles.button} onClick={() => navigate('/products')}>← 戻る</button>
      </div>
    </div>
  );
};

const theme = {
  background: '#1e2a38',
  accent: '#2eccb7',
  text: '#ffffff',
  error: '#ff6b6b',
  card: '#27394e',
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
    lineHeight: '1.8',
  },
  title: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    textAlign: 'center',
    color: theme.accent,
  },
  button: {
    marginTop: '1.5rem',
    backgroundColor: theme.accent,
    color: theme.background,
    border: 'none',
    padding: '0.7rem 1.4rem',
    borderRadius: '6px',
    fontSize: '1rem',
    cursor: 'pointer',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  text: {
    backgroundColor: theme.background,
    color: theme.text,
    padding: '2rem',
    fontSize: '1.1rem',
    textAlign: 'center',
    minHeight: '100vh',
  },
};

export default ProductDetail;