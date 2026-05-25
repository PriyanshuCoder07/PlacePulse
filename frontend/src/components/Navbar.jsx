import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';
import { Sun, Moon } from 'lucide-react';
import { t } from '../theme';

const Navbar = () => {
  const { user, dbUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out!');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      background: t.navbarBg,
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${t.navbarBorder}`,
      position: 'sticky', top: 0, zIndex: 50,
    }} className="px-8 py-4 flex items-center justify-between">

      <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>P</div>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1.2rem' }}>
          <span style={{ color: t.textPrimary }}>Place</span>
          <span style={{ color: t.accent }}>Pulse</span>
        </span>
      </Link>

      <div className="flex items-center gap-5">
        {[{ path: '/', label: 'Experiences' }, { path: '/analytics', label: 'Analytics' }].map(({ path, label }) => (
          <Link key={path} to={path} style={{
            fontFamily: 'Syne, sans-serif', fontSize: '0.9rem', fontWeight: 500,
            color: isActive(path) ? t.textPrimary : t.textMuted,
            textDecoration: 'none', transition: 'color 0.2s',
          }}>{label}</Link>
        ))}

        {dbUser?.isAdmin && (
          <Link to="/admin" style={{
            fontFamily: 'Syne, sans-serif', fontSize: '0.9rem', fontWeight: 500,
            color: t.yellowText, textDecoration: 'none',
          }}>Admin</Link>
        )}

        {/* Theme Toggle */}
        <button onClick={toggleTheme} style={{
          background: t.tagBg,
          border: `1px solid ${t.border}`,
          borderRadius: '0.625rem',
          padding: '0.4rem 0.65rem',
          cursor: 'pointer',
          color: t.textSecondary,
          display: 'flex', alignItems: 'center',
          transition: 'all 0.2s',
        }}>
          {isDark
            ? <Sun size={15} style={{ color: '#fbbf24' }} />
            : <Moon size={15} style={{ color: '#6366f1' }} />}
        </button>

        {user ? (
          <div className="flex items-center gap-3">
            <Link to="/submit" style={{
              background: 'linear-gradient(135deg, #6366f1, #a855f7)',
              fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.85rem',
              color: 'white', padding: '0.5rem 1rem', borderRadius: '0.625rem',
              textDecoration: 'none', transition: 'opacity 0.2s',
            }}>+ Share</Link>
            <img src={user.photoURL} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid #6366f1' }} />
            <button onClick={handleLogout} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: t.textMuted, fontSize: '0.875rem', transition: 'color 0.2s',
            }}>Logout</button>
          </div>
        ) : (
          <Link to="/login" style={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.85rem',
            color: 'white', padding: '0.5rem 1rem', borderRadius: '0.625rem',
            textDecoration: 'none',
          }}>Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;