import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Lock, User } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const passwordRef = useRef(null);

    const handleEmailKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            passwordRef.current?.focus();
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.data.success) {
                sessionStorage.setItem('token', 'true'); // Store token (simulate)
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/dashboard');
            }
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
                <h2 className="text-center mb-4 text-dark">Admin Login</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Email Address</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <User size={18} />
                            </span>
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyDown={handleEmailKeyDown}
                            />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-bold">Password</label>
                        <div className="input-group">
                            <span className="input-group-text">
                                <Lock size={18} />
                            </span>
                            <input
                                ref={passwordRef}
                                type="password"
                                className="form-control"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="btn btn-primary w-100"
                    >
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
