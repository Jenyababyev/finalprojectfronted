import { Outlet, Link } from 'react-router-dom';

const Layout = () => {
    return (
        <>
            <nav>
                <ul>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/cart">Cart</Link></li>
                    <li><Link to="/orders">Order History</Link></li>
                    <li><Link to="/login">Login</Link></li>
                    <li><Link to="/logout">Logout</Link></li>
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/admin/products">Admin</Link></li>
                </ul>
            </nav>
            <main>
                <Outlet />
            </main>
        </>
    );
};

export default Layout;
