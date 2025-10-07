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
        const response = await api.get<Product[]>('/api/products', {
          headers: { Authorization: authToken },
        });
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
    <div>
      <button onClick={logout} style={{ marginBottom: 20}}>
        ログアウト
      </button>
      <h2>商品一覧</h2>
      {products.length === 0 ? (
        <p>商品がありません。</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ￥{product.price.toLocaleString()}
              <button onClick={() => navigate(`/products/detail/${product.id}`)}>Detail</button>
              <button onClick={() => navigate(`/products/update/${product.id}`)}>Update</button>
              <button onClick={() => navigate(`/products/delete/${product.id}`)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate('/products/create')}>Create 新商品作成</button>
    </div>
  );
};

export default Products;
