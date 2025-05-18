import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface CartItem {
    product: {
        _id: string;
        name: string;
        price: number;
    };
    quantity: number;
}

const Cart = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    const handleQuantityChange = (index: number, newQuantity: number) => {
        const updatedCart = [...cart];
        if (newQuantity <= 0) {
            updatedCart.splice(index, 1);
        } else {
            updatedCart[index].quantity = newQuantity;
        }
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
    };

    const totalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (cart.length === 0) return <p>Your cart is empty</p>;

    return (
        <div>
            <h2>Your Cart</h2>
            <ul>
                {cart.map((item, idx) => (
                    // key משלב מזהה מוצר ואינדקס כדי להבטיח ייחודיות
                    <li key={`${item.product._id}-${idx}`}>
                        {item.product.name} - ${item.product.price} x
                        <input
                            type="number"
                            min="0"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(idx, Number(e.target.value))}
                            style={{ width: '50px', marginLeft: '5px' }}
                        />
                    </li>
                ))}
            </ul>
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button onClick={handleCheckout}>Checkout</button>
        </div>
    );
};

export default Cart;
