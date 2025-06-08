import { useSelector } from 'react-redux';
import { Outlet, Link } from 'react-router';
import style from './Layout.module.css';
import type { RootState } from '../store';
//
const Layout = () => {
    const user = useSelector((state: RootState) => state.user.user);

    console.log('User in Layout:', user);

    return (
        <>
            <nav className={style.nav}>
                <ul>
                    <li><Link to="/products">Products</Link></li>
                    <li><Link to="/cart">Cart</Link></li>
                    <li><Link to="/orders">Order History</Link></li>

                    {!user && (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </>
                    )}

                    {user && (
                        <>
                            <li><Link to="/logout">Logout</Link></li>

                            {user.role?.toLowerCase() === 'admin' && (
                                <>
                                    <li><Link to="/admin/products">Admin</Link></li>
                                    <li><Link to="/admin/users">Admin Users</Link></li>
                                </>
                            )}
                        </>
                    )}
                </ul>
            </nav>

            <main>
                <h1>Babyev Phone Shop</h1>
                <Outlet />
            </main>
        </>
    );
};

export default Layout;
