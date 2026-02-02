import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight } from 'lucide-react';
import './Auth.css';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Admin Check
        if (username === 'Admin' && password === 'Admin@123') {
            login({ username: 'Admin', role: 'admin' });
            navigate('/');
            return;
        }

        // Regular User Check
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.username === username && u.password === password);

        if (user) {
            login({ ...user, role: 'user' });
            navigate('/');
        } else {
            alert('Invalid credentials');
        }
    };

    const handleGuestLogin = () => {
        login({ username: 'Guest User', role: 'guest' });
        navigate('/');
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass">
                <h2>Welcome Back</h2>
                <p>Sign in to CineReview</p>

                <form onSubmit={handleSubmit}>
                    <div className="auth-field">
                        <User size={20} />
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="auth-field">
                        <Lock size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary auth-btn">
                        Login <ArrowRight size={18} />
                    </button>
                </form>

                <div className="auth-divider">
                    <span>OR</span>
                </div>

                <button onClick={handleGuestLogin} className="btn btn-ghost guest-btn">
                    Continue as Guest
                </button>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
