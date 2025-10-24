import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/axiosClient';

const ForgotPasswordPage: React.FC = () => {
    const [formData, setFormData] = useState({
        username: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const [shake, setShake] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');
        setShake(false);

        // Validation
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setLoading(false);
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            setShake(true);
            setTimeout(() => setShake(false), 500);
            setLoading(false);
            return;
        }
        
        try {
            await api.auth.forgotPassword(formData);
            setSuccessMessage('Password updated successfully! You can now login with your new password.');

            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Password reset failed. Please try again.');
            setShake(true);
            setTimeout(() => setShake(false), 500);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        if (error) setError('');
    };

    const shakeStyle = {
        animation: shake ? 'shake 0.5s ease-in-out' : 'none'
    };

    const hasValue = (fieldName: string) => {
        return formData[fieldName as keyof typeof formData]?.length > 0;
    };

    return (
        <div style={styles.container}>
            <div style={styles.backgroundAnimation}>
                <div style={styles.floatingShape1}></div>
                <div style={styles.floatingShape2}></div>
                <div style={styles.floatingShape3}></div>
            </div>

            <style>
                {`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
            20%, 40%, 60%, 80% { transform: translateX(5px); }
          }
          
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }

          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }

          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes glow {
            0% { box-shadow: 0 0 20px rgba(155, 89, 182, 0.3); }
            50% { box-shadow: 0 0 30px rgba(155, 89, 182, 0.6); }
            100% { box-shadow: 0 0 20px rgba(155, 89, 182, 0.3); }
          }

          .floating-label {
            position: absolute;
            left: 3rem;
            top: 50%;
            transform: translateY(-50%);
            color: #95a5a6;
            font-size: 1rem;
            font-weight: 500;
            transition: all 0.3s ease;
            pointer-events: none;
          }

          .floating-label.focused,
          .floating-label.has-value {
            top: 0.75rem;
            font-size: 0.8rem;
            color: #9b59b6;
            background: rgba(255, 255, 255, 0.95);
            padding: 0 0.5rem;
            transform: translateY(0);
          }

          input:focus + .floating-label {
            top: 0.75rem;
            font-size: 0.8rem;
            color: #9b59b6;
            background: rgba(255, 255, 255, 0.95);
            padding: 0 0.5rem;
            transform: translateY(0);
          }
        `}
            </style>

            <form
                onSubmit={handleSubmit}
                style={{
                    ...styles.form,
                    ...shakeStyle,
                    animation: 'slideInUp 0.6s ease-out'
                }}
            >
                <div style={styles.logoContainer}>
                    <div style={styles.logo}>
                        🔑
                    </div>
                    <h1 style={styles.title}>Reset Password</h1>
                    <p style={styles.subtitle}>Enter your username and new password</p>
                </div>

                {successMessage && (
                    <div style={styles.successMessage}>
                        <div style={styles.successIcon}>✓</div>
                        {successMessage}
                    </div>
                )}

                {error && (
                    <div style={styles.errorMessage}>
                        <div style={styles.errorIcon}>⚠</div>
                        <div style={styles.errorText}>{error}</div>
                    </div>
                )}

                <div style={styles.inputGroup}>
                    <div style={styles.inputContainer}>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('username')}
                            onBlur={() => setFocusedField(null)}
                            required
                            disabled={loading}
                            placeholder=" "
                            style={{
                                ...styles.input,
                                borderColor: focusedField === 'username' ? '#9b59b6' : error ? '#e74c3c' : '#e1e8ed',
                                boxShadow: focusedField === 'username' ? '0 0 0 3px rgba(155, 89, 182, 0.1)' : 'none'
                            }}
                        />
                        <label
                            className={`floating-label ${focusedField === 'username' ? 'focused' : ''} ${hasValue('username') ? 'has-value' : ''}`}
                        >
                            Username *
                        </label>
                        <div style={styles.inputIcon}>👤</div>
                    </div>
                </div>

                <div style={styles.inputGroup}>
                    <div style={styles.inputContainer}>
                        <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('newPassword')}
                            onBlur={() => setFocusedField(null)}
                            required
                            disabled={loading}
                            minLength={6}
                            placeholder=" "
                            style={{
                                ...styles.input,
                                borderColor: focusedField === 'newPassword' ? '#9b59b6' : error ? '#e74c3c' : '#e1e8ed',
                                boxShadow: focusedField === 'newPassword' ? '0 0 0 3px rgba(155, 89, 182, 0.1)' : 'none'
                            }}
                        />
                        <label
                            className={`floating-label ${focusedField === 'newPassword' ? 'focused' : ''} ${hasValue('newPassword') ? 'has-value' : ''}`}
                        >
                            New Password (min. 6 characters) *
                        </label>
                        <div style={styles.inputIcon}>🔒</div>
                    </div>
                </div>

                <div style={styles.inputGroup}>
                    <div style={styles.inputContainer}>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            onFocus={() => setFocusedField('confirmPassword')}
                            onBlur={() => setFocusedField(null)}
                            required
                            disabled={loading}
                            placeholder=" "
                            style={{
                                ...styles.input,
                                borderColor: focusedField === 'confirmPassword' ? '#9b59b6' : error ? '#e74c3c' : '#e1e8ed',
                                boxShadow: focusedField === 'confirmPassword' ? '0 0 0 3px rgba(155, 89, 182, 0.1)' : 'none'
                            }}
                        />
                        <label
                            className={`floating-label ${focusedField === 'confirmPassword' ? 'focused' : ''} ${hasValue('confirmPassword') ? 'has-value' : ''}`}
                        >
                            Confirm Password *
                        </label>
                        <div style={styles.inputIcon}>✅</div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        ...styles.submitButton,
                        background: loading
                            ? 'linear-gradient(135deg, #95a5a6, #7f8c8d)'
                            : error
                                ? 'linear-gradient(135deg, #e74c3c, #c0392b)'
                                : 'linear-gradient(135deg, #9b59b6, #8e44ad)',
                        transform: loading ? 'scale(0.98)' : 'scale(1)',
                        animation: !loading && !error ? 'glow 2s infinite' : 'none'
                    }}
                >
                    {loading ? (
                        <span style={styles.buttonContent}>
                            <div style={styles.spinner} />
                            Resetting Password...
                        </span>
                    ) : (
                        <span style={styles.buttonContent}>
                            <span style={styles.buttonIcon}>🔄</span>
                            Reset Password
                        </span>
                    )}
                </button>

                <div style={styles.loginContainer}>
                    <p style={styles.loginText}>
                        Remember your password?{' '}
                        <Link to="/login" style={styles.loginLink}>
                            Back to Login
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        padding: '1rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    } as React.CSSProperties,

    backgroundAnimation: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0
    } as React.CSSProperties,

    floatingShape1: {
        position: 'absolute',
        top: '20%',
        left: '10%',
        width: '80px',
        height: '80px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        animation: 'float 6s ease-in-out infinite',
        backdropFilter: 'blur(10px)'
    } as React.CSSProperties,

    floatingShape2: {
        position: 'absolute',
        top: '60%',
        right: '10%',
        width: '120px',
        height: '120px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '30%',
        animation: 'float 8s ease-in-out infinite 2s',
        backdropFilter: 'blur(10px)'
    } as React.CSSProperties,

    floatingShape3: {
        position: 'absolute',
        bottom: '20%',
        left: '20%',
        width: '60px',
        height: '60px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '40%',
        animation: 'float 7s ease-in-out infinite 1s',
        backdropFilter: 'blur(10px)'
    } as React.CSSProperties,

    form: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        padding: '3rem',
        borderRadius: '24px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.2)',
        width: '100%',
        maxWidth: '440px',
        position: 'relative',
        zIndex: 1
    } as React.CSSProperties,

    logoContainer: {
        textAlign: 'center',
        marginBottom: '2.5rem'
    } as React.CSSProperties,

    logo: {
        width: '60px',
        height: '60px',
        background: 'linear-gradient(135deg, #9b59b6, #8e44ad)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: '1.8rem',
        margin: '0 auto 1rem',
        boxShadow: '0 8px 20px rgba(155, 89, 182, 0.3)'
    } as React.CSSProperties,

    title: {
        fontSize: '2.2rem',
        fontWeight: '800',
        background: 'linear-gradient(135deg, #2c3e50, #9b59b6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        margin: '0 0 0.5rem 0'
    } as React.CSSProperties,

    subtitle: {
        color: '#7f8c8d',
        fontSize: '1rem',
        fontWeight: '500',
        margin: 0
    } as React.CSSProperties,

    successMessage: {
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        color: '#27ae60',
        backgroundColor: 'rgba(39, 174, 96, 0.1)',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        fontSize: '0.9rem',
        fontWeight: '500',
        border: '1px solid rgba(39, 174, 96, 0.2)'
    } as React.CSSProperties,

    successIcon: {
        width: '20px',
        height: '20px',
        backgroundColor: '#27ae60',
        color: 'white',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem',
        fontWeight: 'bold'
    } as React.CSSProperties,

    errorMessage: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        color: '#e74c3c',
        backgroundColor: 'rgba(231, 76, 60, 0.1)',
        padding: '1rem 1.25rem',
        borderRadius: '12px',
        marginBottom: '1.5rem',
        border: '1px solid rgba(231, 76, 60, 0.2)'
    } as React.CSSProperties,

    errorIcon: {
        fontSize: '1.1rem',
        flexShrink: 0,
        marginTop: '0.1rem'
    } as React.CSSProperties,

    errorText: {
        fontSize: '0.9rem',
        fontWeight: '500',
        flex: 1
    } as React.CSSProperties,

    inputGroup: {
        marginBottom: '1.5rem'
    } as React.CSSProperties,

    inputContainer: {
        position: 'relative'
    } as React.CSSProperties,

    input: {
        width: '100%',
        padding: '2rem 1rem 1rem 3rem',
        border: '2px solid #e1e8ed',
        borderRadius: '12px',
        boxSizing: 'border-box',
        fontSize: '1rem',
        fontWeight: '500',
        transition: 'all 0.3s ease',
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        outline: 'none',
        color: '#2c3e50'
    } as React.CSSProperties,

    inputIcon: {
        position: 'absolute',
        left: '1rem',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '1.1rem',
        color: '#95a5a6',
        transition: 'color 0.3s ease'
    } as React.CSSProperties,

    submitButton: {
        width: '100%',
        padding: '1.1rem',
        color: 'white',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        fontSize: '1.1rem',
        fontWeight: '600',
        transition: 'all 0.3s ease',
        marginBottom: '1.5rem',
        position: 'relative',
        overflow: 'hidden'
    } as React.CSSProperties,

    buttonContent: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem'
    } as React.CSSProperties,

    buttonIcon: {
        fontSize: '1.2rem',
        transition: 'transform 0.3s ease'
    } as React.CSSProperties,

    spinner: {
        width: '18px',
        height: '18px',
        border: '2px solid transparent',
        borderTop: '2px solid white',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
    } as React.CSSProperties,

    loginContainer: {
        textAlign: 'center'
    } as React.CSSProperties,

    loginText: {
        color: '#7f8c8d',
        fontSize: '0.95rem',
        margin: 0
    } as React.CSSProperties,

    loginLink: {
        color: '#3498db',
        textDecoration: 'none',
        fontWeight: '600',
        transition: 'all 0.3s ease'
    } as React.CSSProperties,
};

export default ForgotPasswordPage;