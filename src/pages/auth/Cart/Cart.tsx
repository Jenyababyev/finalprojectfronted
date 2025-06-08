import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from 'store';
import { updateQuantity } from '@features/cart/cartSlice';
import { useNavigate } from 'react-router';
import style from './Cart.module.css';

const Cart = () => {
    const cart = useSelector((state: RootState) => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        dispatch(updateQuantity({ productId, quantity: newQuantity }));
    };

    const totalPrice = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    const handleCheckout = () => {
        navigate('/checkout');
    };

    if (cart.length === 0) return <p>Your cart is empty</p>;

    return (
        <div className={style.cart}>
            <h2 className={style.cartTitle}>Your Cart</h2>
            <ul className={style.cartList}>
                {cart.map(item => (
                    <li className={style.cartItem} key={item.product._id}>
                        {item.product.name} - ${item.product.price.toFixed(2)} x
                        <input
                            type="number"
                            min={0}
                            value={item.quantity}
                            onChange={e => handleQuantityChange(item.product._id, Number(e.target.value))}
                        />
                    </li>
                ))}
            </ul>
            <h3 className={style.cartTotal}>Total: ${totalPrice.toFixed(2)}</h3>
            <button className={style.checkoutButton} onClick={handleCheckout}>Checkout</button>
        </div>
    );
};

export default Cart;
