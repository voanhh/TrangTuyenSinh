import React, { useState } from 'react';

const LoginForm = () => {
    // State management for form data
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Handle text and checkbox input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Basic validation
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields.');
            setIsLoading(false);
            return;
        }

        try {
            // Replace this with your actual API endpoint logic
            console.log('Authenticating user:', formData);

            // Simulate network request delay
            await new Promise((resolve) => setTimeout(resolve, 1500));

            alert('Login successful!');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Welcome Back</h2>
                    <p style={styles.subtitle}>Please enter your details to sign in</p>
                </div>

                {error && <div style={styles.errorBox}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label htmlFor="email" style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label htmlFor="password" style={styles.label}>Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            style={styles.input}
                            required
                        />
                    </div>

                    <div style={styles.row}>
                        <label style={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                                style={styles.checkbox}
                            />
                            Remember me
                        </label>
                        <a href="#forgot" style={styles.link}>Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        style={{
                            ...styles.button,
                            opacity: isLoading ? 0.7 : 1,
                            cursor: isLoading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {isLoading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <p style={styles.footerText}>
                    Don't have an account? <a href="#signup" style={styles.link}>Sign up</a>
                </p>
            </div>
        </div>
    );
};

// Inline styling object for quick setup without external dependencies
const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    card: {
        width: '100%',
        maxWidth: '400px',
        backgroundColor: '#ffffff',
        padding: '2.5rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    header: {
        marginBottom: '2rem',
        textAlign: 'center',
    },
    title: {
        fontSize: '1.75rem',
        fontWeight: '700',
        color: '#1f2937',
        margin: '0 0 0.5rem 0',
    },
    subtitle: {
        fontSize: '0.875rem',
        color: '#6b7280',
        margin: 0,
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontSize: '0.875rem',
        fontWeight: '500',
        color: '#374151',
    },
    input: {
        padding: '0.75rem 1rem',
        fontSize: '1rem',
        borderRadius: '6px',
        border: '1px solid #d1d5db',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    row: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '0.875rem',
    },
    checkboxLabel: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        color: '#4b5563',
        cursor: 'pointer',
    },
    checkbox: {
        width: '1rem',
        height: '1rem',
        cursor: 'pointer',
    },
    link: {
        color: '#2563eb',
        textDecoration: 'none',
        fontWeight: '500',
    },
    button: {
        backgroundColor: '#2563eb',
        color: '#ffffff',
        padding: '0.75rem',
        fontSize: '1rem',
        fontWeight: '600',
        borderRadius: '6px',
        border: 'none',
        transition: 'background-color 0.2s',
        marginTop: '0.5rem',
    },
    errorBox: {
        backgroundColor: '#fef2f2',
        color: '#dc2626',
        padding: '0.75rem 1rem',
        borderRadius: '6px',
        fontSize: '0.875rem',
        marginBottom: '1.25rem',
        border: '1px solid #fca5a5',
    },
    footerText: {
        textAlign: 'center',
        fontSize: '0.875rem',
        color: '#4b5563',
        marginTop: '2rem',
        marginBottom: 0,
    },
};

export default LoginForm;
