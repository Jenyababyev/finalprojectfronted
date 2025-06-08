import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { fetchProducts, addProduct, deleteProduct } from '@features/product/productsSlice';
import { Navigate } from 'react-router';
import style from './AdminProduct.module.css';

const AdminProduct = () => {
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.user.user);
    const { products, loading, error } = useAppSelector((state) => state.products);

    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [description, setDescription] = useState('');

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleAddProduct = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || price <= 0 || !description.trim()) return;

        dispatch(addProduct({ name: name.trim(), price, description: description.trim() }));

        setName('');
        setPrice(0);
        setDescription('');
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };


    if (!user) {
        return (
            <div>
                <h2>Admin Products</h2>
                <p>Please log in to access this page.</p>
            </div>
        );
    }

    if (user.role !== 'admin') {
        return <Navigate to="/unauthorized" replace />;
    }

    return (
        <div className={style.adminProduct}>
            <h2>Welcome, Admin {user.name}</h2>
            <h3>Manage Products</h3>

            {loading && <p>Loading products...</p>}
            {error && <p className={style.error}>{error}</p>}

            <form className={style.adminProductForm} onSubmit={handleAddProduct}>
                <div>
                    <label>Product Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Price:</label>
                    <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        required
                        min={0.01}
                        step="0.01"
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <button type="submit">Add Product</button>
            </form>

            <ul className={style.adminProductList}>
                {products.map((product: {
                    _id: string;
                    name: string;
                    price: number;
                    description: string;
                }) => (
                    <li key={product._id} className={style.adminProductListItem}>
                        <strong>{product.name}</strong> - ${product.price.toFixed(2)}
                        <p>{product.description}</p>
                        <button
                            className={style.adminDeleteButton}
                            onClick={() => handleDelete(product._id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminProduct;
