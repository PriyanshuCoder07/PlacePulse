import { useState, useEffect } from 'react';
import api from '../lib/axios';
import { t } from '../theme';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#8b5cf6'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: t.bgCard, border: `1px solid ${t.border}`,
        borderRadius: '0.75rem', padding: '0.75rem 1rem',
      }}>
        <p style={{ color: t.textPrimary, fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: '0.875rem' }}>{label}</p>
        <p style={{ color: t.accent, fontSize: '0.875rem', marginTop: '0.25rem' }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get('/admin/analytics').then(res => setData(res.data));
  }, []);

  if (!data) return (
    <div style={{ background: t.bgPrimary, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.textMuted }}>
      Loading analytics...
    </div>
  );

  const card = {
    background: t.bgCard,
    border: `1px solid ${t.border}`,
    borderRadius: '1.25rem',
    padding: '1.5rem',
  };

  return (
    <div style={{ background: t.bgPrimary, minHeight: '100vh', padding: '3rem 1rem' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium mb-4"
            style={{ background: t.accentBg, border: `1px solid ${t.accentBorder}`, color: t.accentText }}>
            📊 Live Data
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '2.5rem', color: t.textPrimary }}>
            Placement <span style={{ color: t.accent }}>Analytics</span>
          </h1>
          <p style={{ color: t.textMuted, marginTop: '0.5rem' }}>
            Data-driven insights from verified placement experiences.
          </p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Experiences', value: data.total, color: '#6366f1' },
            { label: 'Companies Visited', value: data.byCompany?.length, color: '#a855f7' },
            { label: 'Branches Covered', value: data.byBranch?.length, color: '#ec4899' },
          ].map((stat, i) => (
            <div key={i} style={{ ...card, textAlign: 'center' }}>
              <p style={{ fontFamily: 'Syne, sans-serif', fontSize: '2.75rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>
                {stat.value}
              </p>
              <p style={{ color: t.textMuted, fontSize: '0.875rem', marginTop: '0.5rem' }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Top Companies Bar Chart */}
          <div style={card}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: t.textPrimary, marginBottom: '1.25rem' }}>
              🏢 Top Companies
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={data.byCompany} barCategoryGap="30%">
                <XAxis dataKey="_id" tick={{ fill: t.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: t.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {data.byCompany?.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Branch Pie Chart */}
          <div style={card}>
            <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: t.textPrimary, marginBottom: '1.25rem' }}>
              🎓 By Branch
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={data.byBranch} dataKey="count" nameKey="_id"
                  cx="50%" cy="50%" outerRadius={90} innerRadius={40}
                  paddingAngle={3}>
                  {data.byBranch?.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value) => <span style={{ color: t.textSecondary, fontSize: '0.8rem' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Avg CGPA by Company */}
        <div style={card}>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: t.textPrimary, marginBottom: '1.25rem' }}>
            📈 Avg CGPA by Company
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={data.avgCtc} barCategoryGap="30%">
              <XAxis dataKey="_id" tick={{ fill: t.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 10]} tick={{ fill: t.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(168,85,247,0.05)' }} />
              <Bar dataKey="avgCgpa" radius={[6, 6, 0, 0]}>
                {data.avgCtc?.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Analytics;