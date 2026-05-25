import { Link } from 'react-router-dom';
import { ThumbsUp, GraduationCap, IndianRupee } from 'lucide-react';
import { t } from '../theme';

const ExperienceCard = ({ experience }) => {
  return (
    <Link to={`/experience/${experience._id}`}
      style={{
        background: t.bgCard,
        border: `1px solid ${t.border}`,
        transition: 'all 0.2s',
        display: 'block',
        borderRadius: '1rem',
        padding: '1.25rem',
        textDecoration: 'none',
      }}
      className="hover:-translate-y-0.5 hover:shadow-lg">

      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-2"
            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
            {experience.company[0]}
          </div>
          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: t.textPrimary, fontSize: '1.05rem' }}>
            {experience.company}
          </h3>
          <p style={{ color: t.accent, fontSize: '0.875rem', fontWeight: 500 }}>{experience.role}</p>
        </div>
        <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg"
          style={{ background: t.greenBg, border: `1px solid ${t.greenBorder}`, color: t.greenText }}>
          <IndianRupee size={11} />{experience.ctc}
        </span>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <span className="flex items-center gap-1 text-xs px-2 py-1 rounded-md"
          style={{ background: t.tagBg, color: t.textSecondary }}>
          <GraduationCap size={11} />{experience.branch}
        </span>
        <span className="text-xs px-2 py-1 rounded-md" style={{ background: t.tagBg, color: t.textSecondary }}>
          CGPA {experience.cgpa}
        </span>
        <span className="text-xs px-2 py-1 rounded-md" style={{ background: t.tagBg, color: t.textSecondary }}>
          {experience.year}
        </span>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {experience.rounds?.slice(0, 3).map((round, i) => (
          <span key={i} className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: t.pillBg, border: `1px solid ${t.pillBorder}`, color: t.pillText }}>
            {round}
          </span>
        ))}
        {experience.rounds?.length > 3 && (
          <span className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: t.pillBg, color: t.pillText }}>
            +{experience.rounds.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center justify-between"
        style={{ borderTop: `1px solid ${t.border}`, paddingTop: '0.75rem' }}>
        <span style={{ color: t.textMuted, fontSize: '0.75rem' }}>
          {experience.anonymous ? '🎭 Anonymous' : `👤 ${experience.submitterName}`}
        </span>
        <span className="flex items-center gap-1 text-xs" style={{ color: t.textMuted }}>
          <ThumbsUp size={11} />{experience.upvotes?.length || 0}
        </span>
      </div>
    </Link>
  );
};

export default ExperienceCard;