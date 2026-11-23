import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(email, password);

    if (result.success) {
      // Redirect based on user role
      const role = result.data.user.role;
      navigate(role === 'student' ? '/student/dashboard' : '/client/dashboard');
    } else {
      setError(
  result.error?.detail ||
  result.error?.non_field_errors?.[0] ||
  (Array.isArray(result.error) ? result.error[0] : null) ||
  'Login failed'
);
    }

    setLoading(false);
  };

  return (
    <div className="auth-form-side">
      <div className="auth-form-card">
        <form onSubmit={handleSubmit}>
          <div className="field-group">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>

          <div className="field-group" style={{ marginTop: '1.1rem' }}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>

          {error && <div className="form-message error" style={{ marginTop: '1.1rem' }}>{error}</div>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;