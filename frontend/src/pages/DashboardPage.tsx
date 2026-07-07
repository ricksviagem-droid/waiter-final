import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { Settings, RefreshCw, TrendingUp, TrendingDown, Calendar, CreditCard, Bell } from 'lucide-react'
import { api } from '@/lib/api'
import { computeSafeToSpend, formatCurrency, formatDate } from '@/lib/calculations'
import { playDanger, playSuccess, setMuted } from '@/lib/sounds'
import type { Settings as SettingsType, Transaction, SafeToSpendResult } from '@/types'
import { SparklineChart } from '@/components/Dashboard/SparklineChart'
import { SafeCard } from '@/components/Dashboard/SafeCard'

export default function DashboardPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [settings, setSettings] = useState<SettingsType | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [safe, setSafe] = useState<SafeToSpendResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    try {
      const [s, txs] = await Promise.all([
        api.settings.get() as Promise<SettingsType>,
        api.transactions.list() as Promise<Transaction[]>,
      ])
      if (!s) { navigate('/onboarding'); return }
      setSettings(s)
      setTransactions(txs)
      const result = computeSafeToSpend(
        s.currentBalance,
        s.salaryDay,
        s.fixedExpenses,
        s.dangerZoneThreshold
      )
      setSafe(result)
      setMuted(s.isMuted)
      if (result.status === 'red' && !s.isMuted) playDanger()
      else if (result.status === 'green' && !s.isMuted) playSuccess()
    } catch {
      navigate('/onboarding')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [navigate])

  useEffect(() => { load() }, [load])

  async function refresh() { setRefreshing(true); await load() }

  const sparklineData = (() => {
    const days: { date: string; balance: number }[] = []
    let balance = settings?.currentBalance ?? 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const dayStr = d.toISOString().slice(0, 10)
      const dayTxs = transactions.filter(t => t.date.slice(0, 10) === dayStr)
      dayTxs.forEach(t => { balance += t.type === 'credit' ? t.amount : -t.amount })
      days.push({ date: dayStr, balance })
    }
    return days
  })()

  const RATES: Record<string, number> = { BRL: 1, USD: 0.19, EUR: 0.17, GBP: 0.15, AED: 0.70 }
  const secondaryAmounts = (settings?.currenciesSecondary ?? []).map(c => ({
    currency: c,
    amount: (safe?.amount ?? 0) * (RATES[c] ?? 1) / (RATES[settings?.currencyMain ?? 'BRL'] ?? 1),
  }))

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center">
        <div className="text-primary text-3xl animate-spin">⟳</div>
      </div>
    )
  }

  const recentTxs = transactions.slice(0, 5)
  const monthSpend = transactions
    .filter(t => t.type === 'debit' && new Date(t.date).getMonth() === new Date().getMonth())
    .reduce((s, t) => s + t.amount, 0)

  return (
    <div className="max-w-lg mx-auto px-4 pt-5 pb-4">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-xs text-muted-foreground">Olá, {user?.firstName} 👋</div>
          <div className="text-base font-bold text-foreground">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={refresh} className={`p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground transition-colors ${refreshing ? 'animate-spin' : ''}`}>
            <RefreshCw size={16} />
          </button>
          <button onClick={() => navigate('/onboarding')} className="p-2 rounded-xl bg-muted text-muted-foreground hover:text-foreground">
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Safe to Spend Hero */}
      {safe && settings && <SafeCard safe={safe} currency={settings.currencyMain} />}

      {/* Secondary currencies */}
      {secondaryAmounts.length > 0 && safe && (
        <div className="flex gap-2 mt-3">
          {secondaryAmounts.map(({ currency, amount }) => (
            <div key={currency} className="flex-1 bg-card border border-border rounded-xl px-3 py-2 text-center">
              <div className="text-[10px] text-muted-foreground font-semibold">{currency}</div>
              <div className="text-sm font-bold text-foreground">{formatCurrency(amount, currency)}</div>
            </div>
          ))}
        </div>
      )}

      {/* Info cards */}
      {settings && safe && (
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-card border border-border rounded-xl p-3">
            <div className="text-[10px] text-muted-foreground mb-1">Saldo atual</div>
            <div className="text-sm font-bold text-foreground truncate">{formatCurrency(settings.currentBalance, settings.currencyMain)}</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-3">
            <div className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1"><Calendar size={10} />P/ salário</div>
            <div className="text-sm font-bold text-foreground">{safe.daysUntilSalary}d</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-3">
            <div className="text-[10px] text-muted-foreground mb-1 flex items-center gap-1"><CreditCard size={10} />Empréstimo</div>
            <div className="text-sm font-bold text-foreground truncate">{formatCurrency(settings.loanBalance, settings.currencyMain)}</div>
          </div>
        </div>
      )}

      {/* Sparkline */}
      {sparklineData.length > 0 && settings && (
        <div className="bg-card border border-border rounded-2xl p-4 mt-3">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Últimos 7 dias</div>
            {(() => {
              const diff = sparklineData[sparklineData.length - 1].balance - sparklineData[0].balance
              return diff >= 0
                ? <span className="text-[11px] text-green-400 font-bold flex items-center gap-1"><TrendingUp size={12} />+{formatCurrency(diff, settings.currencyMain)}</span>
                : <span className="text-[11px] text-red-400 font-bold flex items-center gap-1"><TrendingDown size={12} />{formatCurrency(diff, settings.currencyMain)}</span>
            })()}
          </div>
          <SparklineChart data={sparklineData} />
        </div>
      )}

      {/* Month spend bar */}
      {settings && (
        <div className="bg-card border border-border rounded-2xl p-4 mt-3">
          <div className="flex justify-between mb-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Gasto este mês</div>
            <span className="text-sm font-bold text-red-400">{formatCurrency(monthSpend, settings.currencyMain)}</span>
          </div>
          {settings.salaryAmount > 0 && (
            <>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (monthSpend / settings.salaryAmount) * 100)}%`,
                    background: monthSpend > settings.salaryAmount * 0.8 ? '#ef4444' : monthSpend > settings.salaryAmount * 0.6 ? '#f59e0b' : '#22c55e',
                  }}
                />
              </div>
              <div className="text-[10px] text-muted-foreground mt-1">
                {Math.round((monthSpend / settings.salaryAmount) * 100)}% do salário
              </div>
            </>
          )}
        </div>
      )}

      {/* Recent transactions */}
      {recentTxs.length > 0 && settings && (
        <div className="bg-card border border-border rounded-2xl p-4 mt-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Últimas transações</div>
          <div className="flex flex-col gap-3">
            {recentTxs.map(tx => (
              <div key={tx.id} className="flex items-center gap-3">
                <div className="text-lg w-7 text-center">{tx.type === 'credit' ? '💰' : '💳'}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">{tx.merchant || tx.category}</div>
                  <div className="text-[11px] text-muted-foreground">{formatDate(tx.date)} · {tx.category}</div>
                </div>
                <span className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount, settings.currencyMain)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <PushOptIn />
    </div>
  )
}

function PushOptIn() {
  const [asked, setAsked] = useState(() => localStorage.getItem('push_asked') === 'true')

  async function enable() {
    localStorage.setItem('push_asked', 'true')
    setAsked(true)
    try {
      const perm = await Notification.requestPermission()
      if (perm === 'granted') {
        const reg = await navigator.serviceWorker.ready
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY,
        })
        await fetch('/api/notifications/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${(window as any).__authToken}` },
          body: JSON.stringify(sub),
        })
      }
    } catch {}
  }

  if (asked || !('Notification' in window) || Notification.permission !== 'default') return null

  return (
    <div className="bg-card border border-primary/30 rounded-2xl p-4 mt-3 flex items-start gap-3">
      <Bell size={18} className="text-primary mt-0.5 flex-shrink-0" />
      <div className="flex-1">
        <div className="text-sm font-bold text-foreground mb-0.5">Receba avisos diários</div>
        <div className="text-xs text-muted-foreground mb-2">Notificação toda manhã com seu Safe to Spend do dia.</div>
        <div className="flex gap-2">
          <button onClick={enable} className="px-3 py-1.5 bg-primary text-primary-foreground text-xs font-bold rounded-lg">Ativar</button>
          <button onClick={() => { setAsked(true); localStorage.setItem('push_asked', 'true') }} className="px-3 py-1.5 bg-muted text-muted-foreground text-xs rounded-lg">Agora não</button>
        </div>
      </div>
    </div>
  )
}
