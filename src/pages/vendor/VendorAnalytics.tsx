import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'
import { api } from '../../utils/api'

export default function VendorAnalytics() {
  const [data, setData] = useState<{
    analyticsData: any[];
    mostSelectedApplicants: any[];
    leastSelectedApplicants: any[];
    neverSelectedApplicants: any[];
    chartColours: string[];
    pieChartData: any[];
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getVendorAnalytics()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return <p className="text-center text-muted" style={{ padding: '3rem' }}>Loading analytics stats...</p>;
  }

  const {
    analyticsData,
    mostSelectedApplicants,
    leastSelectedApplicants,
    neverSelectedApplicants,
    chartColours,
    pieChartData,
  } = data;

  return (
    <div>
      <h2 style={{ marginBottom: '0.35rem' }}>Analytics</h2>
      <p style={{ marginBottom: '2rem' }}>Visual representation of applicant selection data.</p>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { icon: 'emoji_events', label: 'Most Selected', value: mostSelectedApplicants[0]?.name ?? '—', sub: `${mostSelectedApplicants[0]?.selected ?? 0} approvals`, color: 'var(--olive)' },
          { icon: 'arrow_downward', label: 'Least Selected', value: leastSelectedApplicants[0]?.name ?? '—', sub: `${leastSelectedApplicants[0]?.selected ?? 0} approvals`, color: 'var(--charcoal)' },
          { icon: 'do_not_disturb', label: 'Never Selected', value: neverSelectedApplicants.length, sub: 'applicant(s)', color: 'var(--error)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ textAlign: 'center' }}>
            <div className="card-body">
              <span className="material-icons" style={{ fontSize: '1.75rem', color: s.color, display: 'block', marginBottom: '0.4rem' }}>
                {s.icon}
              </span>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                {s.label}
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--charcoal)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {s.value}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div className="card-header">
          <h4>
            <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: 6 }}>bar_chart</span>
            Applicant Selection Count
          </h4>
        </div>
        <div className="card-body">
          {analyticsData.length === 0 ? (
            <p className="text-muted text-center">No data available yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={analyticsData} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: 'var(--text-2)' }}
                  angle={-35}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-2)' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid var(--border)', fontSize: '0.875rem' }}
                  formatter={(v: number) => [v, 'Approvals']}
                />
                <Bar dataKey="selected" fill="var(--charcoal)" radius={[4, 4, 0, 0]}>
                  {analyticsData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? 'var(--olive)' : 'var(--charcoal)'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Pie chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <div className="card-header">
            <h4>
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: 6 }}>pie_chart</span>
              Selection Distribution
            </h4>
          </div>
          <div className="card-body">
            {pieChartData.length === 0 ? (
              <p className="text-muted text-center">No data available yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={pieChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                    {pieChartData.map((_, i) => (
                      <Cell key={i} fill={chartColours[i % chartColours.length]} />
                    ))}
                  </Pie>
                  <Legend wrapperStyle={{ fontSize: '0.8rem' }} />
                  <Tooltip formatter={(v: number) => [`${Math.max(0, v)} approvals`]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Not selected list */}
        <div className="card">
          <div className="card-header">
            <h4>
              <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: 6 }}>do_not_disturb</span>
              Never Selected
            </h4>
            <span className="badge badge-blocked">{neverSelectedApplicants.length}</span>
          </div>
          <div className="card-body">
            {neverSelectedApplicants.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>
                All applicants have been selected at least once.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {neverSelectedApplicants.map(a => (
                  <div
                    key={a.name}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      padding: '0.6rem 0.75rem',
                      background: 'var(--bg-subtle)',
                      borderRadius: 'var(--r)',
                    }}
                  >
                    <div
                      style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'var(--error)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                      }}
                    >
                      {a.name.charAt(0)}
                    </div>
                    <span style={{ fontWeight: 500 }}>{a.name}</span>
                    <span className="badge badge-blocked" style={{ marginLeft: 'auto' }}>0 approvals</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
