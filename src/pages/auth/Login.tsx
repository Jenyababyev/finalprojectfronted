import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@features/user/userSlice';
import { useNavigate } from 'react-router';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // שמירת משתמש רק מתוך data.user
                localStorage.setItem('user', JSON.stringify(data.user));
                dispatch(setUser(data.user));
                navigate('/products');
            } else {
                alert(data.message || 'Login failed');
            }

        } catch (err) {
            console.error('Login error:', err);
            alert('Login failed due to network error');
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
            />
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;
