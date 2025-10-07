import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import Login from './components/Login';
import Products from './components/Products';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { JSX } from 'react/jsx-runtime';

function RequireAuth({ children }: { children: JSX.Element }) {
  const { authToken } = useAuth();
  console.log(authToken);
  
  if (!authToken) {
    // 未ログインならログインページへリダイレクト
    return <Navigate to="/" replace />;
  }
  return children;
}

function App() {
  return (
        <Routes>
          {/* ログインページ */}
          <Route path="/" element={<Login />} />

          {/* 認証が必要なページ */}
          <Route
            path="/products"
            element={
              <RequireAuth>
                <Products />
              </RequireAuth>
            }
          />
        </Routes>
  );
}

export default App;
