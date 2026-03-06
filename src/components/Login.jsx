import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, UserPlus } from 'lucide-react';
import './Login.css';

export default function Login() {
    const [isLoginView, setIsLoginView] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login, signup } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();

        if (!isLoginView && password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        try {
            setError('');
            setLoading(true);

            if (isLoginView) {
                await login(email, password);
            } else {
                await signup(email, password);
            }
            // On success, the AuthContext state will change and App.jsx will render the main UI
        } catch (err) {
            setError('Failed to ' + (isLoginView ? 'log in' : 'create an account') + '. ' + err.message);
        }
        setLoading(false);
    }

    return (
        <div className="login-container fade-in">
            <div className="glass-panel login-card">
                <h2 className="login-title">
                    {isLoginView ? 'Welcome Back' : 'Create Account'}
                </h2>

                <p className="login-subtitle">
                    {isLoginView
                        ? 'Sign in to access your shift configurations.'
                        : 'Register to save your shifts to the cloud.'}
                </p>

                {error && <div className="auth-error">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="input-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {!isLoginView && (
                        <div className="input-group">
                            <label>Confirm Password</label>
                            <input
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    )}

                    <button disabled={loading} className="btn-primary auth-submit" type="submit">
                        {isLoginView ? <><LogIn size={18} /> Log In</> : <><UserPlus size={18} /> Sign Up</>}
                    </button>
                </form>

                <div className="auth-footer">
                    {isLoginView ? "Don't have an account?" : "Already have an account?"}
                    <button
                        type="button"
                        className="btn-link"
                        onClick={() => setIsLoginView(!isLoginView)}
                    >
                        {isLoginView ? 'Sign Up' : 'Log In'}
                    </button>
                </div>
            </div>
        </div>
    );
}
