import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface CartItem {
    product: {
        _id: string;
        name: string;
        price: number;
    };
    quantity: number;
}

const Checkout = () => {
    const [address, setAddress] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const cartString = localStorage.getItem('cart');
        if (!cartString) {
            setError('Cart is empty');
            return;
        }

        const cart: CartItem[] = JSON.parse(cartString);
        if (cart.length === 0) {
            setError('Cart is empty');
            return;
        }

        // המרה למערך של מזהי מוצר וכמויות בלבד
        const items = cart.map(item => ({
            productId: item.product._id,
            quantity: item.quantity
        }));

        try {
            await axios.post(
                'http://localhost:3000/api/orders',
                { address, items },
                { withCredentials: true }
            );
            localStorage.removeItem('cart');
            navigate('/order-confirmation');
        } catch (err) {
            setError('Error placing order');
            console.error('Checkout error', err);
        }
    };

    return (
        <div>
            <h2>Checkout</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    placeholder="Shipping Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                />
                <button type="submit">Place Order</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Checkout;
