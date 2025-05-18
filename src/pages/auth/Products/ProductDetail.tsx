import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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
                const res = await axios.get<Product>(`http://localhost:3000/api/products/${id}`, {
                    withCredentials: true,
                });
                setProduct(res.data);
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
        </div>
    );
};

export default ProductDetail;