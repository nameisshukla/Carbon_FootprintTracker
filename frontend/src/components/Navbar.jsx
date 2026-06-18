import { Link, useNavigate } from 'react-router-dom';
import { Leaf, LogOut, User as UserIcon } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const isAuthenticated = !!user;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav style={{ 
      background: 'rgba(15, 23, 42, 0.75)', 
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      padding: '16px 20px',
      position: 'fixed',
      top: 0,
      width: '100%',
      zIndex: 1000,
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Link to="/" style={{ 
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none'
        }}>
          <Leaf size={32} color="#10B981" />
          <span style={{ 
            fontSize: '1.5rem', 
            fontWeight: '800', 
            color: 'white',
            letterSpacing: '-0.02em'
          }}>
            CarbonTracker
          </span>
        </Link>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                Dashboard
              </Link>
              <Link to="/log-activity" className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                + Log Activity
              </Link>
              <button onClick={handleLogout} className="btn-secondary" style={{ padding: '8px', display: 'flex', alignItems: 'center' }}>
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ 
                color: 'var(--color-text-main)', 
                textDecoration: 'none',
                fontWeight: '500',
                marginRight: '10px',
                transition: 'color 0.2s'
              }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;