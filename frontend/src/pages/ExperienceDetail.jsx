import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { ThumbsUp, ArrowLeft, IndianRupee, Calendar, GraduationCap } from 'lucide-react';
import { t } from '../theme';

const ExperienceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exp, setExp] = useState(null);
  const [upvoted, setUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);

  useEffect(() => {
    api.get(`/experiences/${id}`).then(res => {
      setExp(res.data);
      setUpvoteCount(res.data.upvotes?.length || 0);
    });
  }, [id]);

  const handleUpvote = async () => {
    if (!user) { toast.error('Login to upvote'); return; }
    const res = await api.post(`/experiences/${id}/upvote`);
    setUpvoted(res.data.upvoted);
    setUpvoteCount(res.data.upvotes);
    toast.success(res.data.upvoted ? 'Marked helpful!' : 'Removed');
  };

  if (!exp) return (
    <div style={{ background: t.bgPrimary, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textMuted }}>
      Loading...
    </div>
  );

  const card = {
    background: t.bgCard,
    border: `1px solid ${t.border}`,
    borderRadius: '1.25rem',
    padding: '1.5rem',
    marginBottom: '1rem',
  };

  return (
    <div style={{ background: t.bgPrimary, minHeight: '100vh', padding: '2.5rem 1rem' }}>
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>

        {/* Back button */}
        <button onClick={() => navigate(-1)} style={{
          background: 'none', border: 'none', cursor: 'pointer',
          color: t.textMuted, display: 'flex', alignItems: 'center',
          gap: '0.5rem', fontFamily: 'Syne, sans-serif', fontWeight: 600,
          marginBottom: '2rem', fontSize: '0.9rem', transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = t.textPrimary}
          onMouseLeave={e => e.currentTarget.style.color = t.textMuted}>
          <ArrowLeft size={16} /> Back to Experiences
        </button>

        {/* Header card */}
        <div style={card}>
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              <div style={{
                width: '56px', height: '56px', borderRadius: '1rem',
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontFamily: 'Syne, sans-serif',
                fontWeight: 800, fontSize: '1.5rem', flexShrink: 0,
              }}>
                {exp.company[0]}
              </div>
              <div>
                <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.75rem', color: t.textPrimary, lineHeight: 1.1 }}>
                  {exp.company}
                </h1>
                <p style={{ color: t.accent, fontWeight: 500, marginTop: '0.2rem' }}>{exp.role}</p>
              </div>
            </div>
            <span style={{
              background: t.greenBg, border: `1px solid ${t.greenBorder}`,
              color: t.greenText, fontWeight: 700, padding: '0.4rem 0.875rem',
              borderRadius: '0.75rem', fontSize: '0.9rem', flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: '0.25rem',
            }}>
              <IndianRupee size={14} />{exp.ctc}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {[
              { icon: <GraduationCap size={13} />, text: exp.branch },
              { icon: null, text: `CGPA ${exp.cgpa}` },
              { icon: <Calendar size={13} />, text: `Batch of ${exp.year}` },
            ].map((item, i) => (
              <span key={i} style={{
                background: t.tagBg, color: t.textSecondary,
                padding: '0.3rem 0.75rem', borderRadius: '0.5rem',
                fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem',
              }}>
                {item.icon}{item.text}
              </span>
            ))}
          </div>
        </div>

        {/* Rounds */}
        {exp.rounds?.length > 0 && (
          <div style={card}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: t.textPrimary, fontSize: '1rem', marginBottom: '0.875rem' }}>
              🔄 Interview Rounds
            </h2>
            <div className="flex flex-wrap gap-2">
              {exp.rounds.map((r, i) => (
                <span key={i} style={{
                  background: t.pillBg, border: `1px solid ${t.pillBorder}`,
                  color: t.pillText, padding: '0.35rem 0.875rem',
                  borderRadius: '999px', fontSize: '0.875rem',
                }}>
                  <span style={{ opacity: 0.6, marginRight: '0.3rem' }}>{i + 1}.</span>{r}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Questions */}
        {exp.questionsAsked && (
          <div style={card}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: t.textPrimary, fontSize: '1rem', marginBottom: '0.875rem' }}>
              🧠 Questions Asked
            </h2>
            <p style={{ color: t.textSecondary, lineHeight: 1.8, fontSize: '0.95rem' }}>
              {exp.questionsAsked}
            </p>
          </div>
        )}

        {/* Tips */}
        {exp.tips && (
          <div style={{
            background: t.yellowBg, border: `1px solid ${t.yellowBorder}`,
            borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1rem',
          }}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: t.yellowText, fontSize: '1rem', marginBottom: '0.875rem' }}>
              💡 Tips for You
            </h2>
            <p style={{ color: t.textSecondary, lineHeight: 1.8, fontSize: '0.95rem' }}>
              {exp.tips}
            </p>
          </div>
        )}

        {/* Footer */}
        <div style={card}>
          <div className="flex items-center justify-between">
            <div>
              <p style={{ color: t.textMuted, fontSize: '0.85rem' }}>
                {exp.anonymous ? '🎭 Shared anonymously' : `👤 ${exp.submitterName}`}
              </p>
              <p style={{ color: t.textMuted, fontSize: '0.78rem', marginTop: '0.2rem' }}>
                {new Date(exp.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <button onClick={handleUpvote} style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.6rem 1.25rem', borderRadius: '0.75rem',
              border: `1px solid ${upvoted ? '#6366f1' : t.border}`,
              background: upvoted ? t.accentBg : 'transparent',
              color: upvoted ? t.accentText : t.textSecondary,
              fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
              fontFamily: 'Syne, sans-serif', fontSize: '0.875rem',
            }}>
              <ThumbsUp size={15} /> {upvoteCount} Helpful
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ExperienceDetail;