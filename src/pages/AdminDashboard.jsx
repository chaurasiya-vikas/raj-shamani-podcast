import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

export default function AdminDashboard() {
  const [stats, setStats]         = useState(null)
  const [users, setUsers]         = useState([])
  const [logs, setLogs]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const today     = new Date().toISOString().split('T')[0]
    const thisMonth = new Date().toISOString().slice(0, 7)

    const { data: allLogs } = await supabase
      .from('request_logs')
      .select('*')
      .order('created_at', { ascending: false })

    if (allLogs) {
      const todayLogs   = allLogs.filter(l => l.created_at?.startsWith(today))
      const monthLogs   = allLogs.filter(l => l.created_at?.startsWith(thisMonth))
      const blocked     = allLogs.filter(l => l.status === 'blocked')
      const totalCost   = allLogs.reduce((s, l) => s + (l.estimated_cost_usd || 0), 0)
      const monthCost   = monthLogs.reduce((s, l) => s + (l.estimated_cost_usd || 0), 0)
      const totalTokens = allLogs.reduce((s, l) => s + (l.tokens_used || 0), 0)

      setStats({
        totalCalls:   allLogs.length,
        todayCalls:   todayLogs.length,
        monthCalls:   monthLogs.length,
        blockedCalls: blocked.length,
        totalCost:    totalCost.toFixed(4),
        monthCost:    monthCost.toFixed(4),
        totalTokens,
      })

      const userMap = {}
      allLogs.forEach(l => {
        const email = l.user_email || 'anonymous'
        if (!userMap[email]) {
          userMap[email] = { email, calls: 0, cost: 0, tokens: 0, lastActive: '' }
        }
        userMap[email].calls++
        userMap[email].cost   += l.estimated_cost_usd || 0
        userMap[email].tokens += l.tokens_used || 0
        if (!userMap[email].lastActive || l.created_at > userMap[email].lastActive) {
          userMap[email].lastActive = l.created_at
        }
      })
      setUsers(Object.values(userMap).sort((a, b) => b.calls - a.calls))
      setLogs(allLogs.slice(0, 100))
    }
    setLoading(false)
  }

  const tabStyle = (t) => ({
    padding: '8px 20px', borderRadius: '8px', border: 'none',
    cursor: 'pointer', fontWeight: 600,
    background: activeTab === t ? '#6366f1' : '#1e1e2e',
    color: activeTab === t ? '#fff' : '#aaa',
  })

  const card = (label, value, color = '#6366f1') => (
    <div style={{
      background: '#1e1e2e', borderRadius: 12, padding: '20px 24px',
      borderLeft: `4px solid ${color}`, minWidth: 160
    }}>
      <div style={{ color: '#aaa', fontSize: 13, marginBottom: 6 }}>{label}</div>
      <div style={{ color: '#fff', fontSize: 26, fontWeight: 700 }}>{value}</div>
    </div>
  )

  if (loading) return (
    <div style={{ background: '#0f0f1a', minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20 }}>
      Loading admin data...
    </div>
  )

  return (
    <div style={{ background: '#0f0f1a', minHeight: '100vh', color: '#fff',
      fontFamily: 'Inter, sans-serif', padding: '32px 24px' }}>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: 0 }}>🛡️ Admin Dashboard</h1>
        <p style={{ color: '#aaa', margin: '6px 0 0' }}>Figuring Out — Guest Intelligence System</p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        {['overview', 'users', 'logs'].map(t => (
          <button key={t} style={tabStyle(t)} onClick={() => setActiveTab(t)}>
            {t === 'overview' ? '📊 Overview' : t === 'users' ? '👥 Users' : '📋 Logs'}
          </button>
        ))}
        <button onClick={fetchAll} style={{
          marginLeft: 'auto', padding: '8px 16px', borderRadius: 8,
          border: '1px solid #333', background: 'transparent', color: '#aaa', cursor: 'pointer'
        }}>🔄 Refresh</button>
      </div>

      {activeTab === 'overview' && stats && (
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
            {card('Total API Calls',  stats.totalCalls,                    '#6366f1')}
            {card("Today's Calls",   stats.todayCalls,                    '#10b981')}
            {card('This Month',      stats.monthCalls,                    '#f59e0b')}
            {card('Blocked',         stats.blockedCalls,                  '#ef4444')}
            {card('Total Cost',      `$${stats.totalCost}`,               '#8b5cf6')}
            {card('Month Cost',      `$${stats.monthCost}`,               '#06b6d4')}
            {card('Total Tokens',    stats.totalTokens.toLocaleString(),  '#f97316')}
          </div>

          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>🔥 Feature Usage</h2>
          <div style={{ background: '#1e1e2e', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#2a2a3e' }}>
                  {['Feature', 'Calls', 'Cost (USD)'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left',
                      color: '#aaa', fontSize: 13, fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(
                  logs.reduce((acc, l) => {
                    const f = l.feature || 'unknown'
                    if (!acc[f]) acc[f] = { calls: 0, cost: 0 }
                    acc[f].calls++
                    acc[f].cost += l.estimated_cost_usd || 0
                    return acc
                  }, {})
                ).sort((a, b) => b[1].calls - a[1].calls).map(([feature, data], i) => (
                  <tr key={feature} style={{ borderTop: '1px solid #2a2a3e',
                    background: i % 2 === 0 ? 'transparent' : '#191926' }}>
                    <td style={{ padding: '12px 16px', color: '#fff' }}>{feature}</td>
                    <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: 600 }}>{data.calls}</td>
                    <td style={{ padding: '12px 16px', color: '#f59e0b' }}>${data.cost.toFixed(6)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div style={{ background: '#1e1e2e', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#2a2a3e' }}>
                {['User Email', 'Total Calls', 'Tokens Used', 'Cost (USD)', 'Last Active'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left',
                    color: '#aaa', fontSize: 13, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.email} style={{ borderTop: '1px solid #2a2a3e',
                  background: i % 2 === 0 ? 'transparent' : '#191926' }}>
                  <td style={{ padding: '12px 16px', color: '#6366f1', fontWeight: 600 }}>{u.email}</td>
                  <td style={{ padding: '12px 16px', color: '#fff' }}>{u.calls}</td>
                  <td style={{ padding: '12px 16px', color: '#f97316' }}>{u.tokens.toLocaleString()}</td>
                  <td style={{ padding: '12px 16px', color: '#10b981', fontWeight: 700 }}>${u.cost.toFixed(6)}</td>
                  <td style={{ padding: '12px 16px', color: '#aaa', fontSize: 13 }}>
                    {new Date(u.lastActive).toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'logs' && (
        <div style={{ background: '#1e1e2e', borderRadius: 12, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#2a2a3e' }}>
                {['Time', 'User', 'Feature', 'Status', 'Tokens', 'Cost'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left',
                    color: '#aaa', fontSize: 13, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((l, i) => (
                <tr key={l.id} style={{ borderTop: '1px solid #2a2a3e',
                  background: i % 2 === 0 ? 'transparent' : '#191926' }}>
                  <td style={{ padding: '12px 16px', color: '#aaa', fontSize: 12 }}>
                    {new Date(l.created_at).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#fff', fontSize: 13 }}>
                    {l.user_email?.split('@')[0]}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#6366f1' }}>{l.feature}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: l.status === 'success' ? '#10b98120' : l.status === 'blocked' ? '#ef444420' : '#f59e0b20',
                      color: l.status === 'success' ? '#10b981' : l.status === 'blocked' ? '#ef4444' : '#f59e0b'
                    }}>{l.status}</span>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#f97316' }}>{l.tokens_used || 0}</td>
                  <td style={{ padding: '12px 16px', color: '#10b981' }}>
                    ${(l.estimated_cost_usd || 0).toFixed(6)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}