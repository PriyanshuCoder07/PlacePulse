import { useState } from 'react';
import api from '../lib/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { t } from '../theme';

const Submit = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    company: '', role: '', ctc: '', branch: '',
    cgpa: '', year: '', rounds: '',
    questionsAsked: '', tips: '', anonymous: false,
  });

  const branches = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE'];

  const inputStyle = {
    width: '100%', background: t.bgInput,
    border: `1px solid ${t.borderInput}`,
    borderRadius: '0.75rem',
    padding: '0.625rem 0.875rem',
    color: t.textPrimary, fontSize: '0.9rem',
    outline: 'none', transition: 'border-color 0.2s',
    fontFamily: 'DM Sans, sans-serif',
  };

  const labelStyle = {
    display: 'block', fontSize: '0.78rem', fontWeight: 600,
    color: t.textMuted, marginBottom: '0.375rem',
    textTransform: 'uppercase', letterSpacing: '0.06em',
    fontFamily: 'Syne, sans-serif',
  };

  const focus = e => e.target.style.borderColor = '#6366f1';
  const blur = e => e.target.style.borderColor = t.borderInput;

  const handleSubmit = async () => {
    if (!form.company || !form.role || !form.ctc || !form.branch || !form.cgpa || !form.year) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      await api.post('/experiences', {
        ...form,
        cgpa: Number(form.cgpa),
        year: Number(form.year),
        rounds: form.rounds.split(',').map(r => r.trim()).filter(Boolean),
      });
      toast.success('Submitted! Awaiting approval.');
      navigate('/');
    } catch {
      toast.error('Submission failed. Try again.');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: t.bgPrimary, minHeight: '100vh', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '680px', margin: '0 auto' }}>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{ background: t.accentBg, border: `1px solid ${t.accentBorder}`, color: t.accentText }}>
            ✨ Help your juniors
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2.25rem', color: t.textPrimary, lineHeight: 1.2 }}>
            Share Your<br /><span style={{ color: t.accent }}>Experience</span>
          </h1>
          <p style={{ color: t.textMuted, marginTop: '0.75rem' }}>
            Your story could be the difference for someone's placement journey.
          </p>
        </div>

        {/* Form */}
        <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '1.5rem', padding: '2rem' }}>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label style={labelStyle}>Company *</label>
              <input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })}
                style={inputStyle} placeholder="e.g. Amazon" onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={labelStyle}>Role *</label>
              <input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}
                style={inputStyle} placeholder="e.g. SDE Intern" onFocus={focus} onBlur={blur} />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label style={labelStyle}>CTC *</label>
              <input value={form.ctc} onChange={e => setForm({ ...form, ctc: e.target.value })}
                style={inputStyle} placeholder="e.g. 12 LPA" onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={labelStyle}>CGPA *</label>
              <input type="number" value={form.cgpa} onChange={e => setForm({ ...form, cgpa: e.target.value })}
                style={inputStyle} placeholder="e.g. 8.5" onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={labelStyle}>Year *</label>
              <input type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })}
                style={inputStyle} placeholder="e.g. 2025" onFocus={focus} onBlur={blur} />
            </div>
          </div>

          <div className="mb-4">
            <label style={labelStyle}>Branch *</label>
            <select value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })}
              style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="">Select Branch</option>
              {branches.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="mb-4">
            <label style={labelStyle}>Interview Rounds (comma separated)</label>
            <input value={form.rounds} onChange={e => setForm({ ...form, rounds: e.target.value })}
              style={inputStyle} placeholder="e.g. Aptitude, DSA, OA, HR" onFocus={focus} onBlur={blur} />
          </div>

          <div className="mb-4">
            <label style={labelStyle}>Questions Asked</label>
            <textarea value={form.questionsAsked} onChange={e => setForm({ ...form, questionsAsked: e.target.value })}
              style={{ ...inputStyle, height: '110px', resize: 'none' }}
              placeholder="What topics and questions came up in each round?"
              onFocus={focus} onBlur={blur} />
          </div>

          <div className="mb-6">
            <label style={labelStyle}>Tips for Future Students</label>
            <textarea value={form.tips} onChange={e => setForm({ ...form, tips: e.target.value })}
              style={{ ...inputStyle, height: '110px', resize: 'none' }}
              placeholder="What should they focus on? Any advice you wish you had?"
              onFocus={focus} onBlur={blur} />
          </div>

          {/* Anonymous toggle */}
          <div className="flex items-center gap-3 mb-6 cursor-pointer"
            onClick={() => setForm({ ...form, anonymous: !form.anonymous })}>
            <div style={{
              width: '20px', height: '20px', borderRadius: '6px',
              border: `2px solid ${form.anonymous ? '#a855f7' : t.borderInput}`,
              background: form.anonymous ? 'rgba(168,85,247,0.2)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', flexShrink: 0,
            }}>
              {form.anonymous ? <span style={{ color: '#a855f7', fontSize: '12px' }}>✓</span> : null}
            </div>
            <div>
              <span style={{ color: t.textSecondary, fontSize: '0.9rem', fontWeight: 500 }}>Submit anonymously</span>
              <p style={{ color: t.textMuted, fontSize: '0.8rem', marginTop: '0.1rem' }}>Your name won't be shown publicly</p>
            </div>
          </div>

          {/* Submit button */}
          <button onClick={handleSubmit} disabled={loading} style={{
            width: '100%', border: 'none', borderRadius: '0.875rem',
            padding: '0.9rem', color: 'white',
            fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '1rem',
            cursor: loading ? 'not-allowed' : 'pointer', transition: 'opacity 0.2s',
            background: loading ? t.bgInput : 'linear-gradient(135deg, #6366f1, #a855f7)',
          }}>
            {loading ? 'Submitting...' : 'Submit Experience →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Submit;