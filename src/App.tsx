import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router';

import Login from './pages/auth/Login';
import Logout from './pages/auth/Logout';
import Register from './pages/auth/Register';
import ProductList from './pages/auth/Products/ProductList';
import ProductDetail from './pages/auth/Products/ProductDetail';
import AdminProduct from './pages/auth/Products/AdminProduct';
import Cart from './pages/auth/Cart/Cart';
import Checkout from './pages/auth/Cart/Checkout';
import OrderConfirmation from './pages/auth/Cart/OrderConfirmation';
import OrderHistory from './pages/Orders/OrderHistory';
import Layout from './components/Layout';
import AdminUsers from 'pages/AdminUsers';
import Error from 'pages/Error';
import ProtectedRoute from 'components/ProtectedRoute'; // 
import './App.css';

import { setUser } from '@features/user/userSlice';

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* נתיבים ציבוריים */}
        <Route path="login"
          element={<Login />} />
        <Route path="logout"
          element={<Logout />} />
        <Route path="register"
          element={<Register />} />
        <Route path="products"
          element={<ProductList />} />
        <Route path="products/:id"
          element={<ProductDetail />} />
        {/* נתיבים שדורשים התחברות */}
        <Route path="cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="order-confirmation" element={
          <ProtectedRoute>
            <OrderConfirmation />
          </ProtectedRoute>
        } />
        <Route path="orders" element={
          <ProtectedRoute>
            <OrderHistory />
          </ProtectedRoute>
        } />
        {/* נתיבי אדמין בלבד 🔐 */}
        <Route path="admin/products" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminProduct />
          </ProtectedRoute>
        } />
        <Route path="admin/users" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminUsers />
          </ProtectedRoute>
        } />
        {/* נתיב שגיאה */}
        <Route path="*" element={<Error />} />
      </Route>
    </Routes>
  );
};

export default App;