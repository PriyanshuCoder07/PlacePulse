import { useState, useEffect } from 'react';
import api from '../lib/axios';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Edit3, Eye, EyeOff, Users, BarChart2, Clock, Trash2 } from 'lucide-react';

const TABS = ['Dashboard', 'Pending', 'All Experiences', 'Users'];

const Admin = () => {
  const [tab, setTab] = useState('Dashboard');
  const [pending, setPending] = useState([]);
  const [allExp, setAllExp] = useState([]);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [search, setSearch] = useState('');

  useEffect(() => { fetchAll(); }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [pendingRes, analyticsRes, allExpRes, usersRes] = await Promise.all([
        api.get('/admin/pending'),
        api.get('/admin/analytics'),
        api.get('/admin/all-experiences'),
        api.get('/admin/users'),
      ]);
      setPending(pendingRes.data);
      setAnalytics(analyticsRes.data);
      setAllExp(allExpRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      toast.error('Failed to load data');
    }
    setLoading(false);
  };

  const handleApprove = async (id) => {
    await api.patch(`/admin/${id}/approve`);
    setPending(pending.filter(p => p._id !== id));
    toast.success('✅ Approved!');
    fetchAll();
  };

  const handleReject = async (id) => {
    await api.delete(`/admin/${id}`);
    setPending(pending.filter(p => p._id !== id));
    toast.success('🗑️ Rejected');
    fetchAll();
  };

  const handleDeleteExp = async (id) => {
    await api.delete(`/admin/${id}`);
    setAllExp(allExp.filter(e => e._id !== id));
    toast.success('Deleted');
    fetchAll();
  };

  const handleEdit = (exp) => {
    setEditingId(exp._id);
    setEditForm({
      company: exp.company,
      role: exp.role,
      ctc: exp.ctc,
      branch: exp.branch,
      cgpa: exp.cgpa,
      year: exp.year,
      rounds: exp.rounds?.join(', '),
      questionsAsked: exp.questionsAsked,
      tips: exp.tips,
    });
  };

  const handleSaveEdit = async (id) => {
    try {
      await api.patch(`/admin/${id}/edit`, {
        ...editForm,
        cgpa: Number(editForm.cgpa),
        year: Number(editForm.year),
        rounds: editForm.rounds?.split(',').map(r => r.trim()).filter(Boolean),
      });
      toast.success('Saved!');
      setEditingId(null);
      fetchAll();
    } catch (err) {
      toast.error('Save failed');
    }
  };

  const handleToggleAdmin = async (userId, current) => {
    try {
      await api.patch(`/admin/users/${userId}/toggle-admin`);
      setUsers(users.map(u => u._id === userId ? { ...u, isAdmin: !current } : u));
      toast.success(current ? 'Admin revoked' : 'Admin granted');
    } catch (err) {
      toast.error('Failed');
    }
  };

  const cardStyle = { background: '#13131a', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1rem' };
  const inputStyle = { background: '#1a1a24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.4rem 0.7rem', color: '#e2e0e8', fontSize: '0.85rem', outline: 'none', width: '100%' };

  const filteredPending = pending.filter(e =>
    e.company.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', padding: '2.5rem 1rem' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-3"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24' }}>
            🔐 Admin Panel
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2rem', color: '#f3f4f6' }}>
            PlacePulse <span style={{ color: '#f59e0b' }}>Admin</span>
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{
                padding: '0.5rem 1.25rem', borderRadius: '0.75rem', border: '1px solid',
                fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.875rem',
                cursor: 'pointer', transition: 'all 0.2s',
                borderColor: tab === t ? '#6366f1' : 'rgba(255,255,255,0.08)',
                background: tab === t ? 'rgba(99,102,241,0.15)' : 'transparent',
                color: tab === t ? '#a5b4fc' : '#6b7280',
              }}>
              {t} {t === 'Pending' && pending.length > 0 && (
                <span style={{ background: '#ef4444', color: 'white', borderRadius: '999px', padding: '0 6px', fontSize: '0.7rem', marginLeft: '4px' }}>
                  {pending.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20" style={{ color: '#6b7280' }}>Loading...</div>
        ) : (
          <>
            {/* DASHBOARD TAB */}
            {tab === 'Dashboard' && analytics && (
              <div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  {[
                    { label: 'Total Experiences', value: analytics.total, icon: <BarChart2 size={18} />, color: '#6366f1' },
                    { label: 'Pending Review', value: pending.length, icon: <Clock size={18} />, color: '#f59e0b' },
                    { label: 'Total Users', value: users.length, icon: <Users size={18} />, color: '#a855f7' },
                    { label: 'Companies', value: analytics.byCompany?.length, icon: <Eye size={18} />, color: '#10b981' },
                  ].map((stat, i) => (
                    <div key={i} style={{ ...cardStyle, marginBottom: 0, textAlign: 'center' }}>
                      <div style={{ color: stat.color, marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                      <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '2rem', fontWeight: 800, color: stat.color }}>{stat.value}</p>
                      <p style={{ color: '#6b7280', fontSize: '0.8rem', marginTop: '0.25rem' }}>{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div style={cardStyle}>
                  <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#f3f4f6', marginBottom: '1rem' }}>Top Companies</h2>
                  <div className="space-y-3">
                    {analytics.byCompany?.slice(0, 5).map((c, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span style={{ color: '#6b7280', fontSize: '0.8rem', width: '20px' }}>#{i + 1}</span>
                        <span style={{ color: '#e2e0e8', flex: 1, fontSize: '0.9rem' }}>{c._id}</span>
                        <div style={{ flex: 2, background: 'rgba(255,255,255,0.05)', borderRadius: '999px', height: '6px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #6366f1, #a855f7)', width: `${(c.count / analytics.byCompany[0].count) * 100}%` }} />
                        </div>
                        <span style={{ color: '#a5b4fc', fontSize: '0.85rem', fontWeight: 600, width: '30px', textAlign: 'right' }}>{c.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PENDING TAB */}
            {tab === 'Pending' && (
              <div>
                <input
                  placeholder="🔍 Search by company or role..."
                  value={search} onChange={e => setSearch(e.target.value)}
                  style={{ ...inputStyle, width: '100%', marginBottom: '1.25rem', padding: '0.625rem 0.875rem', borderRadius: '0.75rem', fontSize: '0.9rem' }}
                />
                {filteredPending.length === 0 ? (
                  <div style={{ ...cardStyle, textAlign: 'center', padding: '4rem' }}>
                    <div className="text-4xl mb-3">🎉</div>
                    <p style={{ fontFamily: 'Syne, sans-serif', color: '#f3f4f6', fontWeight: 700 }}>All caught up!</p>
                    <p style={{ color: '#6b7280', marginTop: '0.25rem' }}>No pending submissions.</p>
                  </div>
                ) : filteredPending.map(exp => (
                  <div key={exp._id} style={cardStyle}>
                    {editingId === exp._id ? (
                      <div className="space-y-3">
                        <p style={{ fontFamily: 'Syne, sans-serif', color: '#fbbf24', fontWeight: 700, marginBottom: '0.75rem' }}>✏️ Editing Submission</p>
                        <div className="grid grid-cols-2 gap-3">
                          {['company', 'role', 'ctc', 'branch'].map(field => (
                            <div key={field}>
                              <label style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>{field}</label>
                              <input value={editForm[field]} onChange={e => setEditForm({ ...editForm, [field]: e.target.value })} style={inputStyle} />
                            </div>
                          ))}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {['cgpa', 'year'].map(field => (
                            <div key={field}>
                              <label style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>{field}</label>
                              <input type="number" value={editForm[field]} onChange={e => setEditForm({ ...editForm, [field]: e.target.value })} style={inputStyle} />
                            </div>
                          ))}
                        </div>
                        <div>
                          <label style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Rounds (comma separated)</label>
                          <input value={editForm.rounds} onChange={e => setEditForm({ ...editForm, rounds: e.target.value })} style={inputStyle} />
                        </div>
                        <div>
                          <label style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Questions Asked</label>
                          <textarea value={editForm.questionsAsked} onChange={e => setEditForm({ ...editForm, questionsAsked: e.target.value })} style={{ ...inputStyle, height: '80px', resize: 'none' }} />
                        </div>
                        <div>
                          <label style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Tips</label>
                          <textarea value={editForm.tips} onChange={e => setEditForm({ ...editForm, tips: e.target.value })} style={{ ...inputStyle, height: '80px', resize: 'none' }} />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleSaveEdit(exp._id)}
                            style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.4)', color: '#a5b4fc', padding: '0.5rem 1rem', borderRadius: '0.625rem', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.85rem' }}>
                            Save Changes
                          </button>
                          <button onClick={() => setEditingId(null)}
                            style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#6b7280', padding: '0.5rem 1rem', borderRadius: '0.625rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0"
                              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', fontFamily: 'Syne, sans-serif' }}>
                              {exp.company[0]}
                            </div>
                            <div>
                              <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#f3f4f6' }}>{exp.company}</h2>
                              <p style={{ color: '#a855f7', fontSize: '0.875rem' }}>{exp.role} • {exp.ctc}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => setExpandedId(expandedId === exp._id ? null : exp._id)}
                              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                              {expandedId === exp._id ? <EyeOff size={13} /> : <Eye size={13} />}
                              {expandedId === exp._id ? 'Less' : 'Preview'}
                            </button>
                            <button onClick={() => handleEdit(exp)}
                              style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                              <Edit3 size={13} /> Edit
                            </button>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {[exp.branch, `CGPA ${exp.cgpa}`, exp.year].map((item, i) => (
                            <span key={i} className="text-xs px-2.5 py-1 rounded-lg"
                              style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}>{item}</span>
                          ))}
                        </div>

                        {exp.rounds?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            {exp.rounds.map((r, i) => (
                              <span key={i} className="text-xs px-2 py-0.5 rounded-full"
                                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.2)', color: '#a5b4fc' }}>{r}</span>
                            ))}
                          </div>
                        )}

                        {expandedId === exp._id && (
                          <div className="mt-3 space-y-3">
                            {exp.questionsAsked && (
                              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', padding: '0.875rem' }}>
                                <p style={{ color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Questions Asked</p>
                                <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.6 }}>{exp.questionsAsked}</p>
                              </div>
                            )}
                            {exp.tips && (
                              <div style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.1)', borderRadius: '0.75rem', padding: '0.875rem' }}>
                                <p style={{ color: '#f59e0b', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>Tips</p>
                                <p style={{ color: '#9ca3af', fontSize: '0.875rem', lineHeight: 1.6 }}>{exp.tips}</p>
                              </div>
                            )}
                          </div>
                        )}

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.875rem', marginTop: '0.875rem' }}
                          className="flex items-center justify-between">
                          <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                            By {exp.anonymous ? 'Anonymous' : exp.submittedBy?.name} • {exp.submittedBy?.email}
                          </span>
                          <div className="flex gap-2">
                            <button onClick={() => handleApprove(exp._id)}
                              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#4ade80', padding: '0.5rem 1rem', borderRadius: '0.625rem', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.85rem' }}>
                              <CheckCircle size={14} /> Approve
                            </button>
                            <button onClick={() => handleReject(exp._id)}
                              style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171', padding: '0.5rem 1rem', borderRadius: '0.625rem', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.85rem' }}>
                              <XCircle size={14} /> Reject
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ALL EXPERIENCES TAB */}
            {tab === 'All Experiences' && (
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>{allExp.length} approved experiences</p>
                {allExp.map(exp => (
                  <div key={exp._id} style={cardStyle}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                          style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', fontFamily: 'Syne, sans-serif' }}>
                          {exp.company[0]}
                        </div>
                        <div>
                          <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: '#f3f4f6', fontSize: '0.95rem' }}>{exp.company}</h3>
                          <p style={{ color: '#a855f7', fontSize: '0.8rem' }}>{exp.role} • {exp.branch} • CGPA {exp.cgpa}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {exp.ctc}
                        </span>
                        <button onClick={() => handleDeleteExp(exp._id)}
                          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '0.4rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem' }}>
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* USERS TAB */}
            {tab === 'Users' && (
              <div>
                <p style={{ color: '#6b7280', fontSize: '0.875rem', marginBottom: '1rem' }}>{users.length} registered users</p>
                {users.map(u => (
                  <div key={u._id} style={{ ...cardStyle, marginBottom: '0.75rem' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {u.photo ? (
                          <img src={u.photo} alt="" className="w-10 h-10 rounded-full" />
                        ) : (
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
                            {u.name?.[0]}
                          </div>
                        )}
                        <div>
                          <p style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, color: '#f3f4f6', fontSize: '0.95rem' }}>{u.name}</p>
                          <p style={{ color: '#6b7280', fontSize: '0.8rem' }}>{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {u.isAdmin && (
                          <span style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24', padding: '0.2rem 0.625rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600 }}>
                            Admin
                          </span>
                        )}
                        <button onClick={() => handleToggleAdmin(u._id, u.isAdmin)}
                          style={{ background: u.isAdmin ? 'rgba(239,68,68,0.1)' : 'rgba(99,102,241,0.1)', border: `1px solid ${u.isAdmin ? 'rgba(239,68,68,0.25)' : 'rgba(99,102,241,0.25)'}`, color: u.isAdmin ? '#f87171' : '#a5b4fc', padding: '0.4rem 0.875rem', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.8rem' }}>
                          {u.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;