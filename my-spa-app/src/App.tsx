import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Products from './components/Products';
import { useAuth } from './hooks/useAuth';
import { JSX } from 'react/jsx-runtime';
import ProductDetail from './components/ProductDetail';
import ProductCreate from './components/ProductCreate';
import ProductUpdate from './components/ProductUodate';
import ProductDelete from './components/ProductDelete';

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
          <Route path="/products/detail/:id" element={
            <RequireAuth><ProductDetail /></RequireAuth>
          } />
          <Route path="/products/create" element={
            <RequireAuth><ProductCreate /></RequireAuth>
          } />
          <Route path="/products/update/:id" element={
            <RequireAuth><ProductUpdate /></RequireAuth>
          } />
          <Route path="/products/delete/:id" element={
            <RequireAuth><ProductDelete /></RequireAuth>
          } />
        </Routes>
  );
}

export default App;
