import { Routes, Route } from 'react-router-dom';
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

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="register" element={<Register />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="admin/products" element={<AdminProduct />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="order-confirmation" element={<OrderConfirmation />} />
        <Route path="orders" element={<OrderHistory />} />
      </Route>
    </Routes>
  );
};

export default App;
