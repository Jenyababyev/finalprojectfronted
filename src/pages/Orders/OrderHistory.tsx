import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import type { RootState, AppDispatch } from 'store';
import { fetchOrders } from '@features/orders/ordersSlice';
import style from './OrderHistory.module.css';

const OrderHistory = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { orders, loading, error } = useSelector((state: RootState) => state.orders);
    const { user } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            dispatch(fetchOrders());
        }
    }, [dispatch, navigate, user]);

    if (!user) return null;
    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>{error}</p>;
    if (orders.length === 0) return <p>No orders found.</p>;

    const sortedOrders = [...orders].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <div className={style.orderHistory}>
            <h2 className={style.orderHistoryTitle}>Order History</h2>
            <ul className={style.orderHistoryList}>
                {sortedOrders.map((order) => (
                    <li className={style.orderHistoryItem} key={order._id}>
                        <p>Order ID: {order._id}</p>
                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>

                        <div className={style.orderItemsWrapper}>
                            <ul className={style.orderItemsList}>
                                {order.items.map((item, index) => (
                                    <li key={`${order._id}-${index}`}>
                                        <span>{item.name}</span> — Quantity: {item.quantity} — Price: ${item.price}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <h3 className={style.orderHistoryTotal}>Total: ${order.total}</h3>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderHistory;
