import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../hooks/useAuth';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
}

const Products: React.FC = () => {
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
        const response = await axios.get<Product[]>('/api/products', {
          headers: { Authorization: authToken },
        });
        setProducts(response.data);
      } catch (err: any) {
        if (err.response && err.response.status === 401) {
          setError('認証エラーです。再ログインしてください。');
          logout(); // 認証エラーならログアウト処理
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
      <h2>商品一覧</h2>
      {products.length === 0 ? (
        <p>商品がありません。</p>
      ) : (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ￥{product.price.toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Products;
