import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { api } from '../api/axiosClient';
import type { AuthResponseData, LoginRequest } from '../types/Auth';
import type { ApiResponse } from '../types/Auth'

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState<LoginRequest>({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    setShake(false);
  
    try {
      const response = await api.auth.login(formData);
      const apiResponse: ApiResponse<AuthResponseData> = response.data;
      
      console.log('Login API Response:', apiResponse);
      
      if (apiResponse.status === 'success' && apiResponse.data) {
        localStorage.setItem('authToken', apiResponse.data.token);
        localStorage.setItem('user', JSON.stringify({
          username: apiResponse.data.username,
          email: apiResponse.data.email,
          role: apiResponse.data.role
        }));
        
        console.log('Stored user data:', {
          username: apiResponse.data.username,
          email: apiResponse.data.email,
          role: apiResponse.data.role
        });
        
        navigate('/dashboard');
      } else {
        // Handle specific error messages
        const errorMsg = apiResponse.message || 'Login failed. Please check your credentials.';
        
        // Check for deactivation message
        if (apiResponse.message?.includes('deactivated')) {
          setError('Your account has been deactivated. Please contact your administrator.');
        } else {
          setError(errorMsg);
        }
        
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      
      let errorMsg = 'Login failed. Please try again.';
      
      if (err.response?.data?.message) {
        errorMsg = err.response.data.message;
        
        // Handle deactivation error from backend
        if (err.response.data.message.includes('deactivated')) {
          errorMsg = 'Your account has been deactivated. Please contact your administrator.';
        }
      } else if (err.code === 'NETWORK_ERROR' || err.message === 'Network Error') {
        errorMsg = 'Network error. Please check your connection and try again.';
      } else if (err.response?.status === 401) {
        errorMsg = 'Invalid username or password. Please try again.';
      } else if (err.response?.status === 500) {
        errorMsg = 'Server error. Please try again later.';
      }
      
      setError(errorMsg);
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
    if (error) {
      setError('');
    }
  };

  const shakeStyle = {
    animation: shake ? 'shake 0.5s ease-in-out' : 'none'
  };

  return (
    <div style={styles.container}>
      {/* Background Animation */}
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
          
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.8; }
            100% { opacity: 1; }
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
            0% { box-shadow: 0 0 20px rgba(52, 152, 219, 0.3); }
            50% { box-shadow: 0 0 30px rgba(52, 152, 219, 0.6); }
            100% { box-shadow: 0 0 20px rgba(52, 152, 219, 0.3); }
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
        {/* Logo Header */}
        <div style={styles.logoContainer}>
          <div style={styles.logo}>
            ⚡
          </div>
          <h1 style={styles.title}>Nucleus</h1>
          <p style={styles.subtitle}>Welcome back to your workspace</p>
        </div>
        
        {/* Success Message */}
        {successMessage && (
          <div style={styles.successMessage}>
            <div style={styles.successIcon}>✓</div>
            {successMessage}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={styles.errorMessage}>
            <div style={styles.errorIcon}>⚠</div>
            <div style={styles.errorText}>{error}</div>
            <div style={styles.errorProgress} />
          </div>
        )}

        {/* Form Fields */}
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
                borderColor: focusedField === 'username' ? '#3498db' : error ? '#e74c3c' : '#e1e8ed',
                boxShadow: focusedField === 'username' ? '0 0 0 3px rgba(52, 152, 219, 0.1)' : 'none'
              }}
            />
            <label style={styles.floatingLabel}>Username</label>
            <div style={styles.inputIcon}>👤</div>
          </div>
        </div>

        <div style={styles.inputGroup}>
          <div style={styles.inputContainer}>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              required
              disabled={loading}
              placeholder=" "
              style={{
                ...styles.input,
                borderColor: focusedField === 'password' ? '#3498db' : error ? '#e74c3c' : '#e1e8ed',
                boxShadow: focusedField === 'password' ? '0 0 0 3px rgba(52, 152, 219, 0.1)' : 'none'
              }}
            />
            <label style={styles.floatingLabel}>Password</label>
            <div style={styles.inputIcon}>🔒</div>
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.submitButton,
            background: loading 
              ? 'linear-gradient(135deg, #95a5a6, #7f8c8d)'
              : error
              ? 'linear-gradient(135deg, #e74c3c, #c0392b)'
              : 'linear-gradient(135deg, #3498db, #2980b9)',
            transform: loading ? 'scale(0.98)' : 'scale(1)',
            animation: !loading && !error ? 'glow 2s infinite' : 'none'
          }}
          onMouseDown={(e) => !loading && (e.currentTarget.style.transform = 'scale(0.98)')}
          onMouseUp={(e) => !loading && (e.currentTarget.style.transform = 'scale(1)')}
          onMouseLeave={(e) => !loading && (e.currentTarget.style.transform = 'scale(1)')}
        >
          {loading ? (
            <span style={styles.buttonContent}>
              <div style={styles.spinner} />
              Signing In...
            </span>
          ) : (
            <span style={styles.buttonContent}>
              <span style={styles.buttonIcon}>→</span>
              Sign In
            </span>
          )}
        </button>

        {/* Divider */}
        <div style={styles.divider}>
          <span style={styles.dividerText}>or</span>
        </div>

        {/* Features List */}
        <div style={styles.features}>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>🚀</span>
            Project Management
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>👥</span>
            Team Collaboration
          </div>
          <div style={styles.featureItem}>
            <span style={styles.featureIcon}>📊</span>
            Real-time Analytics
          </div>
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
    width: '100px',
    height: '100px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '50%',
    animation: 'float 6s ease-in-out infinite',
    backdropFilter: 'blur(10px)'
  } as React.CSSProperties,

  floatingShape2: {
    position: 'absolute',
    top: '60%',
    right: '10%',
    width: '150px',
    height: '150px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '30%',
    animation: 'float 8s ease-in-out infinite 2s',
    backdropFilter: 'blur(10px)'
  } as React.CSSProperties,

  floatingShape3: {
    position: 'absolute',
    bottom: '20%',
    left: '20%',
    width: '80px',
    height: '80px',
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
    background: 'linear-gradient(135deg, #3498db, #9b59b6)',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.8rem',
    margin: '0 auto 1rem',
    boxShadow: '0 8px 20px rgba(52, 152, 219, 0.3)'
  } as React.CSSProperties,

  title: {
    fontSize: '2.5rem',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #2c3e50, #3498db)',
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
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    color: '#e74c3c',
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
    padding: '1rem 1.25rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
    border: '1px solid rgba(231, 76, 60, 0.2)',
    overflow: 'hidden'
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

  errorProgress: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '3px',
    backgroundColor: '#e74c3c',
    animation: 'shrink 8s linear forwards'
  } as React.CSSProperties,

  inputGroup: {
    marginBottom: '1.5rem'
  } as React.CSSProperties,

  inputContainer: {
    position: 'relative'
  } as React.CSSProperties,

  input: {
    width: '100%',
    padding: '1.25rem 1rem 1rem 3rem',
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

  floatingLabel: {
    position: 'absolute',
    left: '3rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#95a5a6',
    fontSize: '1rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    pointerEvents: 'none'
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

  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '2rem 0',
    color: '#bdc3c7'
  } as React.CSSProperties,

  dividerText: {
    padding: '0 1rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    backgroundColor: 'rgba(255, 255, 255, 0.95)'
  } as React.CSSProperties,

  features: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: '1px solid rgba(236, 240, 241, 0.5)'
  } as React.CSSProperties,

  featureItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.8rem',
    color: '#7f8c8d',
    fontWeight: '500'
  } as React.CSSProperties,

  featureIcon: {
    fontSize: '1.2rem'
  } as React.CSSProperties,
};

export default LoginPage;