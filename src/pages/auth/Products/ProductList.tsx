import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToCart } from '@features/cart/cartSlice';
import { Link } from 'react-router';
import style from './ProductList.module.css';

interface Product {
    _id: string;
    name: string;
    price: number;
}

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        fetch('http://localhost:3000/api/products')
            .then(res => res.json())
            .then(data => setProducts(data));
    }, []);

    const handleAddToCart = (product: Product) => {
        dispatch(addToCart(product));
    };

    return (
        <div className={style.productList}>
            <h2 className={style.productListTitle}>Products</h2>
            <ul className={style.productListItems}>
                {products.map(p => (
                    <li className={style.productListItem} key={p._id}>
                        <Link to={`/products/${p._id}`}>{p.name}</Link> - ${p.price.toFixed(2)}
                        <button className={style.addToCartButton} onClick={() => handleAddToCart(p)}>Add to Cart</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
