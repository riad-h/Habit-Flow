import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="auth-container">
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <h1>404</h1>
        <p style={{ marginBottom: '1.5rem' }}>This page doesn't exist.</p>
        <Link to="/" className="btn btn-primary">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
