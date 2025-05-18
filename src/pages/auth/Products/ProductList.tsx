import { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
}

const ProductList = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get<Product[]>('http://localhost:3000/api/products');
                setProducts(response.data);
            } catch (err) {
                console.error('Error fetching products', err);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = (product: Product) => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push({ product, quantity: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
    };

    return (
        <div>
            <h2>Products</h2>
            <ul>
                {products.map((product) => (
                    <li key={product._id}>
                        <div>
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <p>${product.price}</p>
                            <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
