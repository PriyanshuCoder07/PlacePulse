import { t } from '../theme';

const FilterBar = ({ filters, setFilters }) => {
  const branches = ['CSE', 'IT', 'ECE', 'EEE', 'ME', 'CE'];
  const years = [2022, 2023, 2024, 2025, 2026];

  const inputStyle = {
    background: t.bgInput,
    border: `1px solid ${t.borderInput}`,
    color: t.textPrimary,
    borderRadius: '0.75rem',
    padding: '0.5rem 0.75rem',
    fontSize: '0.875rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const focus = e => e.target.style.borderColor = '#6366f1';
  const blur = e => e.target.style.borderColor = t.borderInput;

  return (
    <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: '1rem' }}
      className="flex flex-wrap gap-3 p-4">
      <input type="text" placeholder="🔍 Search company, role, questions..."
        value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })}
        style={{ ...inputStyle, flex: 1, minWidth: '200px' }}
        onFocus={focus} onBlur={blur} />
      <select value={filters.branch} onChange={e => setFilters({ ...filters, branch: e.target.value })}
        style={{ ...inputStyle, cursor: 'pointer' }}>
        <option value="">All Branches</option>
        {branches.map(b => <option key={b} value={b}>{b}</option>)}
      </select>
      <select value={filters.year} onChange={e => setFilters({ ...filters, year: e.target.value })}
        style={{ ...inputStyle, cursor: 'pointer' }}>
        <option value="">All Years</option>
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
      <input type="number" placeholder="Min CGPA" value={filters.minCgpa}
        onChange={e => setFilters({ ...filters, minCgpa: e.target.value })}
        style={{ ...inputStyle, width: '100px' }} onFocus={focus} onBlur={blur} />
      <input type="number" placeholder="Max CGPA" value={filters.maxCgpa}
        onChange={e => setFilters({ ...filters, maxCgpa: e.target.value })}
        style={{ ...inputStyle, width: '100px' }} onFocus={focus} onBlur={blur} />
      <button onClick={() => setFilters({ search: '', branch: '', year: '', minCgpa: '', maxCgpa: '' })}
        style={{ color: '#f87171', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer', background: 'none', border: 'none' }}>
        Clear
      </button>
    </div>
  );
};

export default FilterBar;