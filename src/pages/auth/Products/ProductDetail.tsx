import { useEffect, useState } from 'react';
import { useParams } from 'react-router';

interface Product {
    _id: string;
    name: string;
    description: string;
    price: number;
}

const ProductDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const res = await fetch(`http://localhost:3000/api/products/${id}`, {
                    credentials: 'include',
                });
                if (!res.ok) throw new Error('Failed to fetch product');
                const data = await res.json();
                setProduct(data);
            } catch (err) {
                console.error('Error fetching product detail', err);
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) return <p>Loading...</p>;

    return (
        <div>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
            <button onClick={() => window.history.back()}>Go Back</button>
        </div>
    );
};

export default ProductDetail;
