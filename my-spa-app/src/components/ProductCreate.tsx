import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosInstance';
import { useAuth } from '../hooks/useAuth';

const ProductCreate: React.FC = () => {
  const { authToken, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);
  const [stock, setStock] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [description, setDescription]= useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) {
      setError('認証されていません。');
      return;
    }

    try {
      await api.post('/api/products', { name, price, stock, description }, {
        headers: { Authorization: authToken, 'Content-Type': 'application/json' },
      });
      navigate('/products');
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError('認証エラー。再ログインしてください。');
        logout();
      } else {
        setError('商品の作成に失敗しました。');
      }
    }
  };

  return (
    <div>
      <h2>新商品作成</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>名前: </label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label>価格: </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>在庫: </label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
            required
          />
        </div>
        <div>
          <label>説明: </label>
          <input value={description} onChange={(e) => setDescription(e.target.value)} defaultValue={""}/>
        </div>
        <button type="submit">作成</button>
      </form>
      <button onClick={() => navigate('/products')}>戻る</button>
    </div>
  );
};

export default ProductCreate;
