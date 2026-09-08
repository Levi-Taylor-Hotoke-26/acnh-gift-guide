import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { isAuthenticated, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar-header">
      <nav aria-label="Main Navigation" className="navbar">
        <div className="nav-brand">
          <NavLink to="/" className="brand-logo">
            🏝️ ACNH Gift & Island Helper
          </NavLink>
        </div>

        <ul className="nav-links" role="list">
          {isAuthenticated ? (
            <>
              <li>
                <NavLink
                  to="/villagers"
                  className={({ isActive }) => (isActive ? 'active-link' : '')}
                >
                  Island Roster
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/inventory"
                  className={({ isActive }) => (isActive ? 'active-link' : '')}
                >
                  Clothing Closet
                </NavLink>
              </li>
              <li className="user-profile">
                <span>Welcome, {username}!</span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn-logout"
                  aria-label="Log out of account"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink
                  to="/login"
                  className={({ isActive }) => (isActive ? 'active-link' : '')}
                >
                  Login
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className={({ isActive }) => (isActive ? 'active-link' : '')}
                >
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};