import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import type { RootState } from 'store';

const OrderConfirmation = () => {

    const navigate = useNavigate();

    // state.orders  רשימת ההזמנות
    const orders = useSelector((state: RootState) => state.orders.orders);

    // מקבלים את ההזמנה האחרונה לפי תאריך יצירה
    const lastOrder = orders && orders.length > 0
        ? [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
        : null;

    useEffect(() => {
        if (!lastOrder) {
            // אם אין הזמנה, נווט לדף אחר (למשל עגלה)
            navigate('/cart');
        }
    }, [lastOrder, navigate]);
    // בודק אם אין הזמנה
    if (!lastOrder) {
        return <p>Loading...</p>;
    }

    // חישוב סכום כולל
    const total = lastOrder.total ?? lastOrder.items.reduce(
        (acc: number, item: any) => acc + item.price * item.quantity, 0);

    return (
        <div>
            <h2>Order Confirmation</h2>
            <p>Order ID: {lastOrder._id}</p>
            <ul>
                {lastOrder.items.map((item: any, index: number) => (
                    <li key={`${item.name}-${index}`}>
                        {item.name} - Quantity: {item.quantity} - Price: ${item.price}
                    </li>
                ))}
            </ul>
            <h3>Total: ${total}</h3>
        </div>
    );
};

export default OrderConfirmation;
