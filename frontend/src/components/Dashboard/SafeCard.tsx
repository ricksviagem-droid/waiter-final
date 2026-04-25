import type { SafeToSpendResult } from '@/types'
import { formatCurrency } from '@/lib/calculations'

const STATUS = {
  green:  { bg: 'bg-green-500/10',  border: 'border-green-500/30',  text: 'text-green-400',  label: '🟢 Tudo bem!',       bar: '#22c55e' },
  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400', label: '🟡 Atenção',         bar: '#f59e0b' },
  red:    { bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-400',    label: '🔴 Zona de perigo!', bar: '#ef4444' },
}

interface Props {
  safe: SafeToSpendResult
  currency: string
}

export function SafeCard({ safe, currency }: Props) {
  const s = STATUS[safe.status]

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-5 ${s.bg} ${s.border}`}>
      {/* Top shimmer */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${s.bar}, transparent)` }} />

      <div className="text-center">
        <div className={`text-xs font-bold uppercase tracking-widest mb-2 ${s.text}`}>{s.label}</div>
        <div className="text-xs text-muted-foreground mb-1">Safe to Spend hoje</div>
        <div className={`text-5xl font-black tracking-tight ${s.text} mb-1`}>
          {formatCurrency(safe.amount, currency)}
        </div>
        <div className="text-xs text-muted-foreground">por dia, com segurança</div>
      </div>

      {/* Detail row */}
      <div className="flex justify-between mt-4 pt-3 border-t border-white/5 text-[11px] text-muted-foreground">
        <span>Saldo: <strong className="text-foreground">{formatCurrency(safe.currentBalance, currency)}</strong></span>
        <span>Despesas fixas: <strong className="text-foreground">{formatCurrency(safe.fixedExpensesRemaining, currency)}</strong></span>
        <span>{safe.daysUntilSalary}d p/ salário</span>
      </div>
    </div>
  )
}
