import { useState, useEffect } from 'react';
import api from '../lib/axios';
import ExperienceCard from '../components/ExperienceCard';
import FilterBar from '../components/FilterBar';
import { Link } from 'react-router-dom';
import { t } from '../theme';

const Home = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', branch: '', year: '', minCgpa: '', maxCgpa: '' });

  useEffect(() => { fetchExperiences(); }, [filters]);

  const fetchExperiences = async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
      const res = await api.get('/experiences', { params });
      setExperiences(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  return (
    <div style={{ background: t.bgPrimary, minHeight: '100vh' }}>

      {/* Hero Section */}
      <div style={{ position: 'relative', overflow: 'hidden', borderBottom: `1px solid ${t.border}` }}
        className="px-8 py-20 text-center">
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, background: t.heroGlow }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-6"
            style={{ background: t.accentBg, border: `1px solid ${t.accentBorder}`, color: t.accentText }}>
            🎓 Galgotias University • Placement Hub
          </div>
          <h1 style={{
            fontFamily: 'Syne, sans-serif',
            fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
            fontWeight: 800, lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: t.textPrimary,
            marginBottom: '1rem',
          }}>
            Know Before You<br />
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Walk In
            </span>
          </h1>
          <p style={{ color: t.textSecondary, fontSize: '1.1rem', maxWidth: '520px', margin: '0 auto 2rem' }}>
            Real placement experiences from students who've been there. Filter by company, branch, CGPA and more.
          </p>
          <Link to="/submit" style={{
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            fontFamily: 'Syne, sans-serif', fontWeight: 700,
            color: 'white', padding: '0.875rem 2rem',
            borderRadius: '0.875rem', textDecoration: 'none',
            fontSize: '1rem', display: 'inline-block',
            transition: 'opacity 0.2s',
          }}>
            + Share Your Experience
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-6">
          <FilterBar filters={filters} setFilters={setFilters} />
        </div>

        {loading ? (
          <div className="text-center py-20" style={{ color: t.textMuted }}>
            <div className="text-4xl mb-3 animate-pulse">⚡</div>
            <p>Loading experiences...</p>
          </div>
        ) : experiences.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p style={{ color: t.textSecondary, fontSize: '1.1rem' }}>No experiences found.</p>
            <p style={{ color: t.textMuted }}>Be the first to share yours!</p>
          </div>
        ) : (
          <>
            <p style={{ color: t.textMuted, fontSize: '0.875rem', marginBottom: '1rem' }}>
              {experiences.length} experience{experiences.length !== 1 ? 's' : ''} found
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {experiences.map(exp => <ExperienceCard key={exp._id} experience={exp} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;