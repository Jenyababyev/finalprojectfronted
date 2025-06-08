import React, { useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'app/hooks';
import { fetchProducts, addProduct, deleteProduct, updateProduct as updateProductThunk, type Product } from '@features/product/productsSlice';
import { Navigate } from 'react-router';
import style from './AdminProduct.module.css';

const AdminProduct = () => {
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.user.user);
    const { products, loading, error } = useAppSelector((state) => state.products);

    // Single form state for both add and edit
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [description, setDescription] = useState('');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || price <= 0 || !description.trim()) return;

        if (editingProduct) {
            // Update existing product
            const updatedProduct = {
                ...editingProduct,
                name: name.trim(),
                price,
                description: description.trim(),
            };
            dispatch(updateProductThunk({ id: editingProduct._id, updatedProduct }));
        } else {
            // Add new product
            dispatch(addProduct({ name: name.trim(), price, description: description.trim() }));
        }

        // Reset form
        setName('');
        setPrice(0);
        setDescription('');
        setEditingProduct(null);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            dispatch(deleteProduct(id));
        }
    };

    const handleStartEdit = (product: Product) => {
        setEditingProduct(product);
        setName(product.name);
        setPrice(product.price);
        setDescription(product.description);
    };

    const handleCancelEdit = () => {
        setEditingProduct(null);
        setName('');
        setPrice(0);
        setDescription('');
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

            <div>
                <h4>{editingProduct ? 'Edit Product' : 'Add New Product'}</h4>
                {editingProduct && (
                    <p className={style.editingIndicator}>
                        Editing: <strong>{editingProduct.name}</strong>
                    </p>
                )}
                <form className={style.adminProductForm} onSubmit={handleSubmit}>
                    <div>
                        <label>Product Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Enter product name"
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
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            placeholder="Enter product description"
                        />
                    </div>
                    <div className={style.formButtons}>
                        <button type="submit">
                            {editingProduct ? 'Update Product' : 'Add Product'}
                        </button>
                        {editingProduct && (
                            <button type="button" onClick={handleCancelEdit}>
                                Cancel Edit
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Products List */}
            <div>
                <h4>Products List</h4>
                <ul className={style.adminProductList}>
                    {products.map((product: Product) => (
                        <li
                            key={product._id}
                            className={`${style.adminProductListItem} ${editingProduct?._id === product._id ? style.editing : ''
                                }`}
                        >
                            <div className={style.productInfo}>
                                <strong>{product.name}</strong> - ${product.price.toFixed(2)}
                                <p>{product.description}</p>
                            </div>
                            <div className={style.productActions}>
                                <button
                                    className={style.adminUpdateButton}
                                    onClick={() => handleStartEdit(product)}
                                    disabled={editingProduct !== null && editingProduct._id !== product._id}
                                >
                                    {editingProduct?._id === product._id ? 'Editing...' : 'Edit'}
                                </button>
                                <button
                                    className={style.adminDeleteButton}
                                    onClick={() => handleDelete(product._id)}
                                    disabled={editingProduct !== null}
                                >
                                    Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default AdminProduct;