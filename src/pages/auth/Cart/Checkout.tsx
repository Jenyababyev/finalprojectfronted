import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'store';
import { clearCart } from '@features/cart/cartSlice';
import { useNavigate } from 'react-router';

const Checkout = () => {
    const cart = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [address, setAddress] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (cart.length === 0) {
            setError('Cart is empty');
            return;
        }

        const items = cart.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
        }));

        try {
            const response = await fetch('http://localhost:3000/api/orders/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ items, address }),
            });

            if (response.ok) {
                const data = await response.json();

                // שמירת הפרטים ב-localStorage עם שדות מלאים
                localStorage.setItem(
                    'lastOrder',
                    JSON.stringify({
                        orderId: data._id,
                        items: data.items.map((item: any) => ({
                            name: item.product.name,
                            quantity: item.quantity,
                            price: item.product.price,
                        })),
                        total: data.items.reduce(
                            (acc: number, item: any) => acc + item.quantity * (item.product.price || 0),
                            0
                        ),
                    })
                );

                dispatch(clearCart());
                navigate('/order-confirmation');
            } else {
                const data = await response.json();
                setError(data.message || 'Order failed');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Checkout</h2>
            <textarea
                placeholder="Shipping address"
                value={address}
                onChange={e => setAddress(e.target.value)}
                required
            />
            {error && <p>{error}</p>}
            <button type="submit">Place Order</button>
        </form>
    );
};

export default Checkout;
