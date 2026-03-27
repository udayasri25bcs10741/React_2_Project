import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Legend, Cell,
} from 'recharts';

const CHART_COLORS = ['#7c5cfc', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#f97316'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '8px', padding: '0.6rem 1rem',
      }}>
        <p style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.3rem' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ fontSize: '0.8rem', color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export function WeeklyBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124,92,252,0.08)' }} />
        <Bar dataKey="completed" name="Completed" radius={[6, 6, 0, 0]}>
          {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SubjectRadialChart({ data }) {
  if (!data || data.length === 0) return (
    <div className="empty-state" style={{ padding: '2rem' }}>
      <div className="empty-icon">📊</div>
      <p className="empty-sub">Add subjects to see progress chart</p>
    </div>
  );

  const chartData = data.map((s, i) => ({
    name: s.name,
    value: s.pct,
    fill: s.color || CHART_COLORS[i % CHART_COLORS.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <RadialBarChart cx="50%" cy="50%" innerRadius="25%" outerRadius="90%" data={chartData} startAngle={90} endAngle={-270}>
        <RadialBar background={{ fill: 'var(--bg-secondary)' }} dataKey="value" cornerRadius={6} />
        <Legend
          iconSize={10}
          formatter={(value) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{value}</span>}
        />
        <Tooltip content={({ active, payload }) => {
          if (active && payload?.length) {
            const d = payload[0];
            return (
              <div style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: '8px', padding: '0.6rem 1rem', fontSize: '0.8rem',
              }}>
                <p style={{ color: d.payload.fill, fontWeight: 700 }}>{d.payload.name}</p>
                <p style={{ color: 'var(--text-secondary)' }}>Completion: {d.value}%</p>
              </div>
            );
          }
          return null;
        }} />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
