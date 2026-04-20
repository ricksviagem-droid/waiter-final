import { useEffect, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts'
import { Loader2 } from 'lucide-react'
import { api } from '@/lib/api'
import { formatCurrency, getDaysUntilSalary } from '@/lib/calculations'
import type { Transaction, Settings } from '@/types'
import { CATEGORY_ICONS } from '@/types'

const COLORS = ['#22c55e','#3b82f6','#f59e0b','#ef4444','#a78bfa','#38bdf8','#fb923c','#f472b6','#2dd4bf','#facc15','#94a3b8']

const TOOLTIP_STYLE = {
  contentStyle: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: 10, fontSize: 11 },
  labelStyle: { color: '#94a3b8' },
}

type ChartTab = 'projection' | 'categories' | 'loan' | 'history' | 'compare'

const TABS: { key: ChartTab; label: string; icon: string }[] = [
  { key: 'projection',  label: 'Projeção',    icon: '📈' },
  { key: 'categories',  label: 'Categorias',  icon: '🥧' },
  { key: 'loan',        label: 'Empréstimo',  icon: '💳' },
  { key: 'history',     label: 'Histórico',   icon: '📊' },
  { key: 'compare',     label: 'Comparativo', icon: '⚖️' },
]

export default function ChartsPage() {
  const [tab, setTab] = useState<ChartTab>('projection')
  const [settings, setSettings] = useState<Settings | null>(null)
  const [txs, setTxs] = useState<Transaction[]>([])
  const [prevTxs, setPrevTxs] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const now = new Date()
  const curMonth = now.getMonth() + 1
  const curYear = now.getFullYear()
  const prevMonth = curMonth === 1 ? 12 : curMonth - 1
  const prevYear = curMonth === 1 ? curYear - 1 : curYear

  useEffect(() => {
    async function load() {
      try {
        const [s, cur, prev] = await Promise.all([
          api.settings.get() as Promise<Settings>,
          api.transactions.list({ month: curMonth, year: curYear }) as Promise<Transaction[]>,
          api.transactions.list({ month: prevMonth, year: prevYear }) as Promise<Transaction[]>,
        ])
        setSettings(s)
        setTxs(cur)
        setPrevTxs(prev)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-dvh"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
  }

  // ── 1. Balance projection to end of month ──────────────────────────────
  const projectionData = (() => {
    if (!settings) return []
    const daysInMonth = new Date(curYear, curMonth, 0).getDate()
    const balance = settings.currentBalance
    const dailyFixed = (settings.fixedExpenses as any[]).reduce((s: number, e: any) => s + (e.amount || 0), 0) / daysInMonth
    const avgDailySpend = txs.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0) / Math.max(now.getDate(), 1)

    return Array.from({ length: daysInMonth - now.getDate() + 1 }, (_, i) => {
      const day = now.getDate() + i
      const projected = balance - (avgDailySpend + dailyFixed) * i
      return { day: `Dia ${day}`, balance: Math.max(0, Math.round(projected)) }
    })
  })()

  // ── 2. Spending by category (pie) ──────────────────────────────────────
  const categoryData = (() => {
    const map: Record<string, number> = {}
    txs.filter(t => t.type === 'debit').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount
    })
    return Object.entries(map)
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .sort((a, b) => b.value - a.value)
  })()

  // ── 3. Loan evolution (last 6 months mock) ────────────────────────────
  const loanData = (() => {
    if (!settings) return []
    let balance = settings.loanBalance + settings.loanMonthlyPayment * 5
    return Array.from({ length: 6 }, (_, i) => {
      const d = new Date(curYear, curMonth - 6 + i, 1)
      const label = d.toLocaleDateString('pt-BR', { month: 'short' })
      const val = Math.max(0, Math.round(balance))
      balance -= settings.loanMonthlyPayment
      return { month: label, saldo: val }
    })
  })()

  // ── 4. Safe to Spend history 30 days ─────────────────────────────────
  const safeHistory = (() => {
    if (!settings) return []
    const daysUntilSalary = getDaysUntilSalary(settings.salaryDay)
    const fixedTotal = (settings.fixedExpenses as any[]).reduce((s: number, e: any) => s + (e.amount || 0), 0)
    const threshold = settings.dangerZoneThreshold

    return Array.from({ length: 30 }, (_, i) => {
      const daysAgo = 29 - i
      const d = new Date(); d.setDate(d.getDate() - daysAgo)
      const label = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      const dayTxs = txs.filter(t => {
        const td = new Date(t.date)
        return td.toDateString() === d.toDateString()
      })
      const daySpend = dayTxs.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)
      const estBalance = settings.currentBalance + daySpend
      const days = Math.max(daysUntilSalary - (29 - i), 1)
      const safe = Math.max(0, (estBalance - fixedTotal - threshold) / days)
      const status = safe > threshold * 1.5 ? 'green' : safe > threshold ? 'yellow' : 'red'
      return { date: label, safe: Math.round(safe), status }
    })
  })()

  // ── 5. Month comparison ───────────────────────────────────────────────
  const compareData = (() => {
    const curBycat: Record<string, number> = {}
    const prevBycat: Record<string, number> = {}
    txs.filter(t => t.type === 'debit').forEach(t => { curBycat[t.category] = (curBycat[t.category] || 0) + t.amount })
    prevTxs.filter(t => t.type === 'debit').forEach(t => { prevBycat[t.category] = (prevBycat[t.category] || 0) + t.amount })
    const cats = Array.from(new Set([...Object.keys(curBycat), ...Object.keys(prevBycat)]))
    return cats
      .map(c => ({ category: c, atual: Math.round(curBycat[c] || 0), anterior: Math.round(prevBycat[c] || 0) }))
      .sort((a, b) => b.atual - a.atual)
      .slice(0, 6)
  })()

  const currency = settings?.currencyMain || 'BRL'

  return (
    <div className="max-w-lg mx-auto px-4 pt-5 pb-6">
      <h1 className="text-lg font-bold text-foreground mb-4">Gráficos</h1>

      {/* Tab bar */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
              tab === t.key ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border text-muted-foreground'
            }`}>
            <span>{t.icon}</span>{t.label}
          </button>
        ))}
      </div>

      {/* ── 1. Projection ── */}
      {tab === 'projection' && (
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Projeção de saldo até fim do mês</div>
          <div className="text-xs text-muted-foreground mb-4">Baseado na média diária de gastos deste mês.</div>
          {projectionData.length < 2 ? (
            <div className="text-center text-sm text-muted-foreground py-8">Dados insuficientes para projeção.</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={projectionData}>
                <defs>
                  <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b' }} interval={4} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [formatCurrency(v, currency), 'Saldo projetado']} />
                <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={2} fill="url(#projGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* ── 2. Categories ── */}
      {tab === 'categories' && (
        <div className="flex flex-col gap-3">
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Gastos por categoria — {new Date(curYear, curMonth - 1).toLocaleDateString('pt-BR', { month: 'long' })}</div>
            {categoryData.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground py-8">Nenhum gasto neste mês.</div>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} dataKey="value">
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [formatCurrency(v, currency), 'Total']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          {/* Bar breakdown */}
          {categoryData.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-4">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Detalhamento</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={categoryData} layout="vertical" margin={{ left: 10 }}>
                  <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={v => `R$${v}`} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} width={80}
                    tickFormatter={v => `${CATEGORY_ICONS[v] || '📦'} ${v}`} />
                  <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [formatCurrency(v, currency), 'Total']} />
                  <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* ── 3. Loan ── */}
      {tab === 'loan' && (
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Evolução do empréstimo</div>
          <div className="text-xs text-muted-foreground mb-4">Últimos 6 meses com parcela de {formatCurrency(settings?.loanMonthlyPayment || 0, currency)}/mês.</div>
          {(settings?.loanBalance || 0) === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">Nenhum empréstimo ativo.</div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={loanData}>
                <defs>
                  <linearGradient id="loanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={v => `R$${(v/1000).toFixed(0)}k`} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [formatCurrency(v, currency), 'Saldo devedor']} />
                <Area type="monotone" dataKey="saldo" stroke="#ef4444" strokeWidth={2} fill="url(#loanGrad)" dot={{ fill: '#ef4444', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      )}

      {/* ── 4. Safe to Spend history ── */}
      {tab === 'history' && (
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Histórico Safe to Spend — 30 dias</div>
          <div className="text-xs text-muted-foreground mb-4">🟢 seguro · 🟡 atenção · 🔴 perigo</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={safeHistory} margin={{ left: -10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: '#64748b' }} interval={6} />
              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={v => `R$${v}`} />
              <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [formatCurrency(v, currency), 'Safe to Spend']} />
              <Bar dataKey="safe" radius={[4, 4, 0, 0]}>
                {safeHistory.map((entry, i) => (
                  <Cell key={i} fill={entry.status === 'green' ? '#22c55e' : entry.status === 'yellow' ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── 5. Month comparison ── */}
      {tab === 'compare' && (
        <div className="bg-card border border-border rounded-2xl p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Mês atual vs anterior</div>
          <div className="text-xs text-muted-foreground mb-4">Top categorias de gasto.</div>
          {compareData.length === 0 ? (
            <div className="text-center text-sm text-muted-foreground py-8">Dados insuficientes.</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={compareData} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} tickFormatter={v => `R$${v}`} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 10, fill: '#94a3b8' }} width={85}
                  tickFormatter={v => `${CATEGORY_ICONS[v] || '📦'} ${v}`} />
                <Tooltip {...TOOLTIP_STYLE} formatter={(v: number) => [formatCurrency(v, currency)]} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="atual" name="Este mês" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                <Bar dataKey="anterior" name="Mês anterior" fill="#475569" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}

          {/* Summary comparison */}
          <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-border">
            {[
              { label: 'Este mês', txList: txs, color: 'text-blue-400' },
              { label: 'Mês anterior', txList: prevTxs, color: 'text-muted-foreground' },
            ].map(({ label, txList, color }) => {
              const total = txList.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)
              const count = txList.filter(t => t.type === 'debit').length
              return (
                <div key={label} className="bg-muted rounded-xl p-3">
                  <div className="text-[10px] text-muted-foreground mb-1">{label}</div>
                  <div className={`text-base font-black ${color}`}>{formatCurrency(total, currency)}</div>
                  <div className="text-[10px] text-muted-foreground">{count} transações</div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
