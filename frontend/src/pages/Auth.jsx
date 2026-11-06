import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useShop } from '../App';


export default function Auth() {
  const { login } = useShop();
  const navigate = useNavigate();
  const location = useLocation();
  const isSignup = location.pathname === '/signup';

  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password || (isSignup && !formData.name)) {
      return setError('Please fill in all required fields.');
    }
    if (formData.password.length < 8) {
      return setError('Password must be at least 8 characters long.');
    }

    setLoading(true);
    const url = isSignup
      ? 'http://localhost:5000/api/auth/register'
      : 'http://localhost:5000/api/auth/login';

    const payload = isSignup
      ? formData
      : { email: formData.email, password: formData.password };

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong. Please try again.');

      if (isSignup) {
        navigate('/login');
      } else {
        login(data.user, data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Unable to connect to the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">{isSignup ? 'Create Account' : 'Welcome Back'}</h1>
        <p className="auth-subtitle">
          {isSignup
            ? 'Create your NOVARA account to start shopping.'
            : 'Sign in to your NOVARA account to continue.'}
        </p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {isSignup && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
            {isSignup && <small>Password must be at least 8 characters.</small>}
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Please wait...' : isSignup ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        <p className="auth-switch">
          {isSignup ? (
            <>Already have an account? <Link to="/login">Sign In</Link></>
          ) : (
            <>Don&apos;t have an account? <Link to="/signup">Create Account</Link></>
          )}
        </p>
      </div>
    </div>
  );
}