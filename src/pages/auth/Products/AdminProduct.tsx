import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

interface User {
    _id: string;
    name: string;
    role: string;
}

interface Product {
    _id: string;
    name: string;
    price: number;
    description: string;
}

const AdminProduct = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // ניהול מוצרים
    const [products, setProducts] = useState<Product[]>([]);
    const [name, setName] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [description, setDescription] = useState('');

    useEffect(() => {
        const fetchUserAndProducts = async () => {
            try {
                // מביא את פרטי המשתמש עם קוקיז
                const resUser = await axios.get('/api/me', { withCredentials: true });
                setUser(resUser.data);

                // מביא את רשימת המוצרים
                const resProducts = await axios.get('/api/products');
                setProducts(resProducts.data);
            } catch (err) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndProducts();
    }, []);

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post(
                '/api/products',
                { name, price, description },
                { withCredentials: true }
            );
            setProducts(prev => [...prev, res.data]);
            setName('');
            setPrice(0);
            setDescription('');
        } catch (err) {
            console.error('Failed to add product', err);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await axios.delete(`/api/products/${id}`, { withCredentials: true });
            setProducts(prev => prev.filter(p => p._id !== id));
        } catch (err) {
            console.error('Failed to delete product', err);
        }
    };

    // --- טיפול במצבים ---

    if (loading) {
        return <p>Loading user data...</p>;
    }

    if (!user) {
        // אם לא מחובר מפנה לעמוד ההתחברות
        return <Navigate to="/login" replace />;
    }

    if (user.role !== 'admin') {
        // אם לא אדמין מפנה לדף הרשאות (אפשר גם להציג הודעה במקום)
        return <Navigate to="/unauthorized" replace />;
    }

    // אם הכל תקין, מציג את רכיב הניהול
    return (
        <div>
            <h2>Welcome, Admin {user.name}</h2>
            <h3>Admin Products</h3>

            <form onSubmit={handleAddProduct} style={{ marginBottom: 20 }}>
                <div>
                    <label>Product Name: </label>
                    <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Price: </label>
                    <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(Number(e.target.value))}
                        required
                        min={0}
                        step="0.01"
                    />
                </div>
                <div>
                    <label>Description: </label>
                    <textarea
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Add Product</button>
            </form>

            <ul>
                {products.map(product => (
                    <li key={product._id} style={{ marginBottom: 10 }}>
                        <strong>{product.name}</strong> - ${product.price.toFixed(2)}
                        <p>{product.description}</p>
                        <button onClick={() => handleDelete(product._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AdminProduct;
