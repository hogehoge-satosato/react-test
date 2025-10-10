import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
}

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { authToken, logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authToken) {
      setError('認証されていません。ログインしてください。');
      return;
    }

    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get<Product[]>('/api/products');
        setProducts(response.data);
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          setError('認証エラーです。再ログインしてください。');
          logout();
        } else {
          setError('商品の取得に失敗しました。');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [authToken, logout]);

  if (loading) {
    return <p>読み込み中...</p>;
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

    return (
    <div style={styles.container}>
      <button style={styles.logoutButton} onClick={logout}>
        ログアウト
      </button>

      <h2 style={styles.heading}>商品一覧</h2>

      {products.length === 0 ? (
        <p style={styles.text}>商品がありません。</p>
      ) : (
        <div style={styles.cardGrid}>
          {products.map((product) => (
            <div key={product.id} style={styles.card}>
              <h3 style={styles.cardTitle}>{product.name}</h3>
              <p style={styles.cardText}>￥{product.price.toLocaleString()}</p>
              <p style={styles.cardText}>在庫: {product.stock}</p>
              <p style={styles.cardText}>{product.description}</p>
              <div style={styles.buttonGroup}>
                <button style={styles.actionButton} onClick={() => navigate(`/products/detail/${product.id}`)}>詳細</button>
                <button style={styles.actionButton} onClick={() => navigate(`/products/update/${product.id}`)}>編集</button>
                <button style={styles.actionButton} onClick={() => navigate(`/products/delete/${product.id}`)}>削除</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button style={styles.createButton} onClick={() => navigate('/products/create')}>
        ＋ 新商品を作成
      </button>
    </div>
  );
};

const theme = {
  background: '#1e2a38',
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
    fontFamily: 'sans-serif',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '1.5rem',
  },
  text: {
    fontSize: '1.1rem',
  },
  logoutButton: {
    alignSelf: 'flex-end',
    backgroundColor: 'transparent',
    color: theme.accent,
    border: `1px solid ${theme.accent}`,
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    marginBottom: '1rem',
  },
  createButton: {
    marginTop: '2rem',
    backgroundColor: theme.accent,
    color: theme.background,
    padding: '0.8rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    width: '100%',
    maxWidth: '1000px',
  },
  card: {
    backgroundColor: '#27394e',
    padding: '1rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '0.3rem',
  },
  cardText: {
    margin: 0,
    fontSize: '0.95rem',
  },
  buttonGroup: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
  },
  actionButton: {
    flex: 1,
    backgroundColor: theme.accent,
    color: theme.background,
    border: 'none',
    padding: '0.4rem',
    margin: '0 0.2rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.85rem',
  },
};

export default Products;