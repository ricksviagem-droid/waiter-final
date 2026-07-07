import { useState } from 'react'
import { Loader2, RefreshCw, Star, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import { api } from '@/lib/api'
import type { FinancialScore } from '@/types'

const STATUS_CONFIG = {
  'ótimo':   { color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30',  bar: '#22c55e', icon: '🏆' },
  'bom':     { color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   bar: '#3b82f6', icon: '👍' },
  'atenção': { color: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', bar: '#f59e0b', icon: '⚠️' },
  'crítico': { color: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30',    bar: '#ef4444', icon: '🚨' },
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 54
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ

  return (
    <svg width={140} height={140} className="rotate-[-90deg]">
      <circle cx={70} cy={70} r={r} fill="none" stroke="#1e293b" strokeWidth={10} />
      <circle
        cx={70} cy={70} r={r} fill="none"
        stroke={color} strokeWidth={10}
        strokeLinecap="round"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  )
}

export default function ScorePage() {
  const [score, setScore] = useState<FinancialScore | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function fetchScore() {
    setLoading(true)
    setError('')
    try {
      const result = await api.ai.score() as FinancialScore
      setScore(result)
    } catch {
      setError('Não foi possível calcular o score. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const cfg = score ? (STATUS_CONFIG[score.status] ?? STATUS_CONFIG['atenção']) : null

  return (
    <div className="max-w-lg mx-auto px-4 pt-5 pb-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Star size={18} className="text-primary" />
            <h1 className="text-lg font-bold text-foreground">Score Financeiro</h1>
          </div>
          <p className="text-xs text-muted-foreground">Análise IA dos seus dados reais — 0 a 100.</p>
        </div>
        {score && (
          <button onClick={fetchScore} disabled={loading}
            className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground">
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        )}
      </div>

      {!score && !loading && (
        <div className="bg-card border border-border rounded-2xl p-8 text-center mb-4">
          <div className="text-4xl mb-3">🤖</div>
          <div className="text-base font-bold text-foreground mb-2">Analisar minha saúde financeira</div>
          <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
            O GPT-4o vai analisar seu saldo, gastos por categoria, Safe to Spend e taxa de poupança para gerar um score personalizado com insights reais.
          </p>
          <button onClick={fetchScore}
            className="px-6 py-3 bg-primary text-primary-foreground font-bold text-sm rounded-xl w-full">
            Calcular meu Score agora
          </button>
        </div>
      )}

      {loading && (
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <Loader2 size={32} className="animate-spin text-primary mx-auto mb-3" />
          <div className="text-sm font-semibold text-foreground mb-1">Analisando seus dados…</div>
          <div className="text-xs text-muted-foreground">O GPT-4o está processando suas finanças.</div>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 mb-4">
          {error}
        </div>
      )}

      {score && cfg && (
        <div className="flex flex-col gap-3">

          {/* Score ring card */}
          <div className={`rounded-2xl border p-5 ${cfg.bg} ${cfg.border}`}>
            <div className="flex items-center justify-center gap-6">
              <div className="relative">
                <ScoreRing score={score.score} color={cfg.bar} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-3xl font-black ${cfg.color}`}>{score.score}</span>
                  <span className="text-[10px] text-muted-foreground font-semibold">/ 100</span>
                </div>
              </div>
              <div>
                <div className="text-2xl mb-1">{cfg.icon}</div>
                <div className={`text-lg font-black capitalize ${cfg.color}`}>{score.status}</div>
                <div className="text-xs text-muted-foreground mt-1 max-w-[140px] leading-relaxed">{score.sugestao}</div>
              </div>
            </div>
          </div>

          {/* Score breakdown bar */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Escala de saúde</div>
            <div className="relative h-4 bg-muted rounded-full overflow-hidden">
              <div className="absolute inset-0 flex">
                <div className="flex-1 bg-red-500/40" />
                <div className="flex-1 bg-yellow-500/40" />
                <div className="flex-1 bg-blue-500/40" />
                <div className="flex-1 bg-green-500/40" />
              </div>
              <div
                className="absolute top-0 bottom-0 w-3 rounded-full border-2 border-white"
                style={{ left: `calc(${score.score}% - 6px)`, background: cfg.bar, transition: 'left 1s ease' }}
              />
            </div>
            <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
              <span>Crítico</span><span>Atenção</span><span>Bom</span><span>Ótimo</span>
            </div>
          </div>

          {/* Insights */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <TrendingUp size={12} /> Insights da IA
            </div>
            <div className="flex flex-col gap-3">
              {score.insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${cfg.bg}`}>
                    <span className="text-[10px] font-black" style={{ color: cfg.bar }}>{i + 1}</span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{insight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-card border border-border rounded-2xl p-4">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
              {score.status === 'ótimo' || score.status === 'bom'
                ? <><CheckCircle size={12} className="text-green-400" /> Recomendação</>
                : <><AlertTriangle size={12} className="text-yellow-400" /> Ação recomendada</>}
            </div>
            <p className="text-sm text-foreground leading-relaxed">{score.sugestao}</p>
          </div>

          {/* Re-analyze */}
          <button onClick={fetchScore} disabled={loading}
            className="w-full py-3 rounded-xl border border-border bg-muted text-muted-foreground text-sm font-semibold flex items-center justify-center gap-2 hover:text-foreground transition-colors">
            <RefreshCw size={14} /> Recalcular score
          </button>
        </div>
      )}
    </div>
  )
}
