import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      login(data.token, data.username);
      navigate('/villagers');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred during login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-container">
      <h1>Island Resident Login</h1>
      {error && (
        <div id="login-error" role="alert" className="error-banner">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate className="auth-form">
        <div className="form-group">
          <label htmlFor="login-username">Username</label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-required="true"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'login-error' : undefined}
            disabled={isSubmitting}
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-required="true"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'login-error' : undefined}
            disabled={isSubmitting}
            autoComplete="current-password"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="auth-switch">
        Need an island passport? <Link to="/register">Register here</Link>.
      </p>
    </main>
  );
};