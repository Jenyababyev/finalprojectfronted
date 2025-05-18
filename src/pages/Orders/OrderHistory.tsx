import { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
    _id: string;
    name: string;
    price: number;
}

interface OrderItem {
    product: Product;
    quantity: number;
}

interface Order {
    _id: string;
    createdAt: string;
    items: OrderItem[];
    total: number;
}

const OrderHistory = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get<Order[]>('http://localhost:3000/api/orders', {
                    withCredentials: true,
                });
                setOrders(response.data);
            } catch (err) {
                setError('Error fetching orders');
                console.error('Error fetching orders', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>{error}</p>;
    if (orders.length === 0) return <p>No orders found.</p>;

    return (
        <div>
            <h2>Order History</h2>
            <ul>
                {orders.map((order) => (
                    <li key={order._id}>
                        <p>Order ID: {order._id}</p>
                        <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                        <ul>
                            {order.items.map((item) => (
                                <li key={item.product._id}>
                                    {item.product.name} - Quantity: {item.quantity} - Price: ${item.product.price}
                                </li>
                            ))}
                        </ul>
                        <h3>Total: ${order.total}</h3>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default OrderHistory;
