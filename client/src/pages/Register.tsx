import { useState } from 'react';
import type { SyntheticEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim() || !password) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed.');
      }

      navigate('/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="auth-container">
      <h1>Register Island Passport</h1>
      {error && (
        <div id="register-error" role="alert" className="error-banner">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} noValidate className="auth-form">
        <div className="form-group">
          <label htmlFor="reg-username">Username</label>
          <input
            id="reg-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-required="true"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'register-error' : undefined}
            disabled={isSubmitting}
            autoComplete="username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-password">Password</label>
          <input
            id="reg-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-required="true"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'register-error' : undefined}
            disabled={isSubmitting}
            autoComplete="new-password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="reg-confirm">Confirm Password</label>
          <input
            id="reg-confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            aria-required="true"
            aria-invalid={Boolean(error)}
            aria-describedby={error ? 'register-error' : undefined}
            disabled={isSubmitting}
            autoComplete="new-password"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Registering...' : 'Create Account'}
        </button>
      </form>

      <p className="auth-switch">
        Already registered? <Link to="/login">Login here</Link>.
      </p>
    </main>
  );
};