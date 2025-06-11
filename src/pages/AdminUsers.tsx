import { useState, useEffect } from 'react';
import { Navigate } from 'react-router';
import style from './AdminUsers.module.css';

interface User {
    _id: string;
    name: string;
    email: string;
    role: string;

}

const AdminUsers = () => {
    // 
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUserAndUsers = async () => {
            try {
                const userRes = await fetch('/api/me', {
                    credentials: 'include',
                });

                if (!userRes.ok) {
                    setUser(null);
                    return;
                }

                const userData = await userRes.json();
                setUser(userData);

                const usersRes = await fetch('/api/users', {
                    credentials: 'include',
                });

                if (!usersRes.ok) throw new Error('Failed to fetch users');
                const usersData = await usersRes.json();
                setUsers(usersData);
            } catch (err) {
                console.error('Error fetching users:', err);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAndUsers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            const res = await fetch(`/api/users/${id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Failed to delete user');

            setUsers((prev) => prev.filter((u) => u._id !== id));
        } catch (err) {
            console.error('Error deleting user:', err);
        }
    };

    if (loading) return <p>Loading...</p>;

    if (!user) {
        return (
            <div>
                <h2>Admin Users</h2>
                <p>Please log in to access this page.</p>
            </div>
        );
    }

    if (user.role !== 'admin') {
        return <Navigate to="/unauthorized" replace />;
    }

    return (
        <div className={style.adminUsers}>
            <h2 className={style.adminUsersTitle}>Welcome, Admin {user.name}</h2>
            <h3>User Management</h3>

            <table className={style.adminUsersTable} border={1} cellPadding={10}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u._id}>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>
                                {u._id !== user._id && (
                                    <button onClick={() => handleDelete(u._id)}>Delete</button>

                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;
