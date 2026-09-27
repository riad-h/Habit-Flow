import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const createdDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown';

  return (
    <div className="main-content">
      <div className="page-header">
        <h1>Profile</h1>
        <p>Your account information.</p>
      </div>

      <div className="profile-card">
        <div className="profile-info">
          <div className="profile-field">
            <span className="profile-field-label">Email</span>
            <span className="profile-field-value">{user?.email || 'Not available'}</span>
          </div>
          <div className="profile-field">
            <span className="profile-field-label">Account created</span>
            <span className="profile-field-value">{createdDate}</span>
          </div>
          <div className="profile-field">
            <span className="profile-field-label">User ID</span>
            <span className="profile-field-value" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
              {user?.id || 'Not available'}
            </span>
          </div>
        </div>

        <button className="btn btn-danger" onClick={handleLogout}>
          Sign out
        </button>
      </div>
    </div>
  );
}
