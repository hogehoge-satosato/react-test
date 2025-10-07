import React from 'react';
import Login from './components/Login';
import Products from './components/Products';
import { useAuth } from './hooks/useAuth';

const App: React.FC = () => {
  const { authToken, logout } = useAuth();

  return (
    <div style={{ padding: 20 }}>
      {authToken ? (
        <>
          <button onClick={logout} style={{ marginBottom: 20 }}>
            ログアウト
          </button>
          <Products />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
};

export default App;
