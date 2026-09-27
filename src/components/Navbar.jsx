import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <NavLink to="/" className="navbar-brand">
        <span>◐</span> Habit-Flow
      </NavLink>
      <ul className="navbar-nav">
        <li>
          <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
            Today
          </NavLink>
        </li>
        <li>
          <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''}>
            History
          </NavLink>
        </li>
        <li>
          <NavLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
            Profile
          </NavLink>
        </li>
        <li>
          <button onClick={handleLogout} className="logout-btn" aria-label="Log out">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
}
