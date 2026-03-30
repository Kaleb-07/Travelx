import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authLogin } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validation';
import '../styles/login.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      setError(emailValidation.message);
      return;
    }

    setLoading(true);
    try {
      const result = await authLogin({ email, password });
      login(result);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container login-container">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="auth-box">
        <div className="auth-header">
          <div className="auth-logo-container">
            <i className="fas fa-globe"></i>
            <h1>Son-Caleb</h1>
          </div>
          <p className="auth-subtitle">Your Adventure Awaits</p>
        </div>

        <div className="auth-card">
          <div className="card-header">
            <h2>Welcome Back</h2>
            <p>Sign in to explore amazing destinations</p>
          </div>

          <div className="card-content">
            {error && (
              <div className="error-message">
                <i className="fas fa-exclamation-circle"></i>
                <span>{error}</span>
              </div>
            )}

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">
                  <i className="fas fa-envelope"></i> Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <div className="label-wrapper">
                  <label htmlFor="password">
                    <i className="fas fa-lock"></i> Password
                  </label>
                  <a href="#" className="forgot-link">Forgot?</a>
                </div>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i>
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <p className="auth-link">
              Don&apos;t have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            By signing in, you agree to our{' '}
            <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}
