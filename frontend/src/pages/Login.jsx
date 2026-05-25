import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { t } from '../theme';

const Login = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { if (user) navigate('/'); }, [user]);

  const handleLogin = async () => {
    try {
      await login();
      toast.success('Welcome to PlacePulse!');
      navigate('/');
    } catch {
      toast.error('Login failed. Try again.');
    }
  };

  return (
    <div style={{
      background: t.bgPrimary, minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Background glow */}
      <div style={{ position: 'absolute', inset: 0, background: t.heroGlow }} />
      <div style={{ position: 'absolute', top: '20%', left: '15%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(168,85,247,0.05)', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(99,102,241,0.07)', filter: 'blur(60px)' }} />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '420px', padding: '0 1.5rem' }}>
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '1.5rem', padding: '2.5rem' }}>

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>P</div>
            <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: t.textPrimary }}>
              Place<span style={{ color: t.accent }}>Pulse</span>
            </h1>
            <p style={{ color: t.textMuted, fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Your college's placement intelligence platform
            </p>
          </div>

          {/* Features */}
          <div style={{ marginBottom: '2rem' }}>
            {[
              '📊 Real data from real students',
              '🔍 Filter by company, branch, CGPA',
              '🎯 Know exactly what to prepare',
              '🤝 Help your juniors by sharing',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-sm mb-3"
                style={{ color: t.textSecondary }}>
                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>

          {/* Google Login Button */}
          <button onClick={handleLogin} style={{
            width: '100%',
            background: t.bgInput,
            border: `1px solid ${t.borderInput}`,
            borderRadius: '0.875rem',
            padding: '0.875rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
            color: t.textPrimary, fontSize: '0.95rem', fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.2s',
            fontFamily: 'DM Sans, sans-serif',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'}
            onMouseLeave={e => e.currentTarget.style.borderColor = t.borderInput}>
            <img src="https://www.google.com/favicon.ico" style={{ width: '20px', height: '20px' }} alt="" />
            Continue with Google
          </button>

          <p style={{ color: t.textMuted, fontSize: '0.75rem', textAlign: 'center', marginTop: '1rem' }}>
            By signing in, you agree to share placement data responsibly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;