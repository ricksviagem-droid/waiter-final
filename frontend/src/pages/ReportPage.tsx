import { useEffect, useRef, useState } from 'react'
import { FileText, Download, Loader2, TrendingDown, TrendingUp } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { api } from '@/lib/api'
import { formatCurrency, computeSafeToSpend } from '@/lib/calculations'
import type { Transaction, Settings, FinancialScore } from '@/types'
import { CATEGORY_ICONS } from '@/types'

const COLORS = ['#22c55e','#3b82f6','#f59e0b','#ef4444','#a78bfa','#38bdf8','#fb923c','#f472b6']
const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

export default function ReportPage() {
  const reportRef = useRef<HTMLDivElement>(null)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [txs, setTxs] = useState<Transaction[]>([])
  const [prevTxs, setPrevTxs] = useState<Transaction[]>([])
  const [score, setScore] = useState<FinancialScore | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [loadingScore, setLoadingScore] = useState(false)

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

  async function fetchScore() {
    setLoadingScore(true)
    try {
      const s = await api.ai.score() as FinancialScore
      setScore(s)
    } finally {
      setLoadingScore(false)
    }
  }

  async function generatePDF() {
    if (!reportRef.current) return
    setGenerating(true)
    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        backgroundColor: '#0a1628',
        useCORS: true,
        logging: false,
      })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const imgH = (canvas.height * pageW) / canvas.width
      let y = 0
      while (y < imgH) {
        if (y > 0) pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, -y, pageW, imgH)
        y += pageH
      }
      const fileName = `SafeSpend_${MONTHS_PT[curMonth - 1]}_${curYear}.pdf`
      pdf.save(fileName)
    } finally {
      setGenerating(false)
    }
  }

  // Derived data
  const totalDebit   = txs.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)
  const totalCredit  = txs.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)
  const prevDebit    = prevTxs.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)
  const balance      = totalCredit - totalDebit
  const diffPct      = prevDebit > 0 ? ((totalDebit - prevDebit) / prevDebit) * 100 : 0

  const categoryData = (() => {
    const map: Record<string, number> = {}
    txs.filter(t => t.type === 'debit').forEach(t => { map[t.category] = (map[t.category] || 0) + t.amount })
    return Object.entries(map).map(([name, value]) => ({ name, value: Math.round(value) })).sort((a, b) => b.value - a.value)
  })()

  const compareData = (() => {
    const curMap: Record<string, number> = {}
    const prevMap: Record<string, number> = {}
    txs.filter(t => t.type === 'debit').forEach(t => { curMap[t.category] = (curMap[t.category] || 0) + t.amount })
    prevTxs.filter(t => t.type === 'debit').forEach(t => { prevMap[t.category] = (prevMap[t.category] || 0) + t.amount })
    const cats = Array.from(new Set([...Object.keys(curMap), ...Object.keys(prevMap)]))
    return cats.map(c => ({ category: c.slice(0, 8), atual: Math.round(curMap[c] || 0), anterior: Math.round(prevMap[c] || 0) }))
      .sort((a, b) => b.atual - a.atual).slice(0, 5)
  })()

  const safe = settings ? computeSafeToSpend(settings.currentBalance, settings.salaryDay, settings.fixedExpenses, settings.dangerZoneThreshold) : null
  const currency = settings?.currencyMain || 'BRL'

  const TOOLTIP = { contentStyle: { background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 10 } }

  if (loading) {
    return <div className="flex justify-center items-center min-h-dvh"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-5 pb-6">

      {/* Page header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <FileText size={18} className="text-primary" />
            <h1 className="text-lg font-bold text-foreground">Relatório PDF</h1>
          </div>
          <p className="text-xs text-muted-foreground">{MONTHS_PT[curMonth - 1]} {curYear}</p>
        </div>
        <div className="flex gap-2">
          {!score && (
            <button onClick={fetchScore} disabled={loadingScore}
              className="flex items-center gap-1.5 px-3 py-2 bg-muted text-muted-foreground text-xs font-bold rounded-xl disabled:opacity-50">
              {loadingScore ? <Loader2 size={12} className="animate-spin" /> : '🤖'} Score IA
            </button>
          )}
          <button onClick={generatePDF} disabled={generating}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl disabled:opacity-50">
            {generating ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            {generating ? 'Gerando…' : 'Baixar PDF'}
          </button>
        </div>
      </div>

      {/* ── Report content (captured for PDF) ── */}
      <div ref={reportRef} style={{ background: '#0a1628', padding: 20, borderRadius: 16, fontFamily: 'system-ui, sans-serif' }}>

        {/* Report title */}
        <div style={{ textAlign: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #1e293b' }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: '#22c55e', marginBottom: 2 }}>SafeSpend</div>
          <div style={{ fontSize: 13, color: '#94a3b8' }}>Relatório Financeiro — {MONTHS_PT[curMonth - 1]} {curYear}</div>
          <div style={{ fontSize: 11, color: '#475569', marginTop: 4 }}>Gerado em {new Date().toLocaleDateString('pt-BR')}</div>
        </div>

        {/* Safe to Spend hero */}
        {safe && (
          <div style={{
            background: safe.status === 'green' ? 'rgba(34,197,94,0.1)' : safe.status === 'yellow' ? 'rgba(245,158,11,0.1)' : 'rgba(239,68,68,0.1)',
            border: `1px solid ${safe.status === 'green' ? 'rgba(34,197,94,0.3)' : safe.status === 'yellow' ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)'}`,
            borderRadius: 12, padding: 16, marginBottom: 16, textAlign: 'center',
          }}>
            <div style={{ fontSize: 10, color: '#94a3b8', marginBottom: 4, letterSpacing: 2 }}>SAFE TO SPEND — HOJE</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: safe.status === 'green' ? '#22c55e' : safe.status === 'yellow' ? '#f59e0b' : '#ef4444' }}>
              {formatCurrency(safe.amount, currency)}
            </div>
            <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>por dia · {safe.daysUntilSalary} dias até o salário</div>
          </div>
        )}

        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
          {[
            { label: 'Saldo atual', value: formatCurrency(settings?.currentBalance || 0, currency), color: '#22c55e' },
            { label: 'Total saídas', value: formatCurrency(totalDebit, currency), color: '#ef4444' },
            { label: 'Total entradas', value: formatCurrency(totalCredit, currency), color: '#3b82f6' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#0f1f35', border: '1px solid #1e293b', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: '#64748b', marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Month comparison highlight */}
        <div style={{ background: '#0f1f35', border: '1px solid #1e293b', borderRadius: 10, padding: 12, marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, color: '#64748b', marginBottom: 3 }}>Vs. mês anterior</div>
            <div style={{ fontSize: 12, color: '#94a3b8' }}>
              {MONTHS_PT[prevMonth - 1]}: <strong style={{ color: '#f1f5f9' }}>{formatCurrency(prevDebit, currency)}</strong>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: diffPct > 0 ? '#ef4444' : '#22c55e' }}>
              {diffPct > 0 ? '▲' : '▼'} {Math.abs(diffPct).toFixed(1)}%
            </div>
            <div style={{ fontSize: 10, color: diffPct > 0 ? '#ef4444' : '#22c55e' }}>
              {diffPct > 0 ? 'gastei mais' : 'gastei menos'}
            </div>
          </div>
        </div>

        {/* Category pie */}
        {categoryData.length > 0 && (
          <div style={{ background: '#0f1f35', border: '1px solid #1e293b', borderRadius: 10, padding: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>GASTOS POR CATEGORIA</div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <ResponsiveContainer width={100} height={100}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={28} outerRadius={46} dataKey="value" paddingAngle={2}>
                    {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1 }}>
                {categoryData.slice(0, 5).map((c, i) => (
                  <div key={c.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>{CATEGORY_ICONS[c.name] || '📦'} {c.name}</span>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#f1f5f9' }}>{formatCurrency(c.value, currency)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Monthly comparison bar */}
        {compareData.length > 0 && (
          <div style={{ background: '#0f1f35', border: '1px solid #1e293b', borderRadius: 10, padding: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>COMPARATIVO MENSAL</div>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={compareData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 9, fill: '#64748b' }} tickFormatter={v => `R$${v}`} />
                <YAxis type="category" dataKey="category" tick={{ fontSize: 9, fill: '#94a3b8' }} width={60} />
                <Tooltip {...TOOLTIP} formatter={(v: number) => [formatCurrency(v, currency)]} />
                <Bar dataKey="atual" name="Este mês" fill="#3b82f6" radius={[0, 3, 3, 0]} />
                <Bar dataKey="anterior" name="Mês anterior" fill="#334155" radius={[0, 3, 3, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* AI Score */}
        {score && (
          <div style={{
            background: score.status === 'ótimo' ? 'rgba(34,197,94,0.08)' : score.status === 'bom' ? 'rgba(59,130,246,0.08)' : 'rgba(245,158,11,0.08)',
            border: '1px solid #1e293b', borderRadius: 10, padding: 12, marginBottom: 16,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, letterSpacing: 2 }}>SCORE DE SAÚDE FINANCEIRA</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: score.status === 'ótimo' ? '#22c55e' : score.status === 'bom' ? '#3b82f6' : '#f59e0b' }}>
                {score.score}/100
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#f1f5f9', fontWeight: 700, marginBottom: 8, textTransform: 'capitalize' }}>
              Status: {score.status}
            </div>
            {score.insights.map((ins, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 5 }}>
                <span style={{ color: '#22c55e', fontSize: 10, flexShrink: 0 }}>•</span>
                <span style={{ fontSize: 10, color: '#94a3b8', lineHeight: 1.5 }}>{ins}</span>
              </div>
            ))}
            <div style={{ marginTop: 8, padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
              <div style={{ fontSize: 9, color: '#64748b', marginBottom: 2 }}>SUGESTÃO</div>
              <div style={{ fontSize: 10, color: '#cbd5e1', lineHeight: 1.5 }}>{score.sugestao}</div>
            </div>
          </div>
        )}

        {/* Loan info */}
        {settings && settings.loanBalance > 0 && (
          <div style={{ background: '#0f1f35', border: '1px solid #1e293b', borderRadius: 10, padding: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>EMPRÉSTIMO ATIVO</div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 9, color: '#64748b' }}>Saldo devedor</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#ef4444' }}>{formatCurrency(settings.loanBalance, currency)}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: '#64748b' }}>Parcela mensal</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>{formatCurrency(settings.loanMonthlyPayment, currency)}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: '#64748b' }}>Meses restantes</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>
                  {settings.loanMonthlyPayment > 0 ? Math.ceil(settings.loanBalance / settings.loanMonthlyPayment) : '—'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top 5 transactions */}
        {txs.length > 0 && (
          <div style={{ background: '#0f1f35', border: '1px solid #1e293b', borderRadius: 10, padding: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>MAIORES GASTOS DO MÊS</div>
            {txs.filter(t => t.type === 'debit').sort((a, b) => b.amount - a.amount).slice(0, 5).map((tx, i) => (
              <div key={tx.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i < 4 ? 7 : 0, borderBottom: i < 4 ? '1px solid #1e293b' : 'none', marginBottom: i < 4 ? 7 : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14 }}>{CATEGORY_ICONS[tx.category] || '📦'}</span>
                  <div>
                    <div style={{ fontSize: 11, color: '#f1f5f9', fontWeight: 600 }}>{tx.merchant || tx.category}</div>
                    <div style={{ fontSize: 9, color: '#64748b' }}>{tx.category} · {new Date(tx.date).toLocaleDateString('pt-BR')}</div>
                  </div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 800, color: '#ef4444' }}>{formatCurrency(tx.amount, currency)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', paddingTop: 12, borderTop: '1px solid #1e293b' }}>
          <div style={{ fontSize: 10, color: '#334155' }}>SafeSpend · Relatório gerado automaticamente · {new Date().toLocaleString('pt-BR')}</div>
        </div>
      </div>

      {/* Action footer */}
      <div className="mt-4 flex flex-col gap-2">
        {!score && (
          <div className="bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-lg">🤖</span>
            <div className="flex-1 text-xs text-muted-foreground">Adicione o Score IA para um relatório mais completo.</div>
            <button onClick={fetchScore} disabled={loadingScore}
              className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg flex items-center gap-1.5">
              {loadingScore ? <Loader2 size={12} className="animate-spin" /> : <span>Gerar</span>}
            </button>
          </div>
        )}

        <button onClick={generatePDF} disabled={generating}
          className="w-full py-3.5 bg-primary text-primary-foreground font-bold text-sm rounded-xl flex items-center justify-center gap-2 disabled:opacity-50">
          {generating ? <><Loader2 size={16} className="animate-spin" />Gerando PDF…</> : <><Download size={16} />Baixar Relatório PDF</>}
        </button>

        <p className="text-center text-[10px] text-muted-foreground">
          O PDF captura tudo que está visível acima — gráficos, score e transações.
        </p>
      </div>
    </div>
  )
}
