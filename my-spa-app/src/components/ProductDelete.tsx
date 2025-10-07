import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';

const ProductDelete: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { authToken, logout } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!authToken || !id) {
      setError('認証されていません。');
      return;
    }

    try {
      await api.delete(`/api/products/${id}`, {
        headers: { Authorization: authToken },
      });
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

  return (
    <div>
      <h2>商品削除</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>本当に商品ID {id} を削除しますか？</p>
      <button onClick={handleDelete}>削除</button>
      <button onClick={() => navigate('/products')}>キャンセル</button>
    </div>
  );
};

export default ProductDelete;
