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
        const response = await api.get<Product>(`/api/products/${id}`, {
          headers: { Authorization: authToken },
        });
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
    <div>
      <h2>商品詳細</h2>
      <p>ID: {product.id}</p>
      <p>名前: {product.name}</p>
      <p>価格: ￥{product.price.toLocaleString()}</p>
      <p>在庫: {product.stock}</p>
      <p>説明: {product.description}</p>
      <button onClick={() => navigate('/products')}>戻る</button>
    </div>
  );
};

export default ProductDetail;
