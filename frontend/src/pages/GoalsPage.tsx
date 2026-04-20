import { useEffect, useState } from 'react'
import { Plus, Trash2, Target, Loader2, Check, X, Sparkles } from 'lucide-react'
import { api } from '@/lib/api'
import { playGoalReached, playTransaction } from '@/lib/sounds'
import { formatCurrency, formatDate } from '@/lib/calculations'
import type { Goal } from '@/types'

interface NewGoal {
  title: string
  targetAmount: string
  targetDate: string
}

const EMPTY: NewGoal = { title: '', targetAmount: '', targetDate: '' }

function GoalCard({ goal, onContribute, onDelete }: {
  goal: Goal
  onContribute: (id: string, amount: number) => void
  onDelete: (id: string) => void
}) {
  const pct = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100)
  const remaining = goal.targetAmount - goal.currentAmount
  const daysLeft = Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  const dailyNeeded = daysLeft > 0 ? remaining / daysLeft : 0
  const done = pct >= 100
  const [contrib, setContrib] = useState('')
  const [showContrib, setShowContrib] = useState(false)

  function handleContrib() {
    const val = parseFloat(contrib)
    if (!val || val <= 0) return
    onContribute(goal.id, val)
    setContrib('')
    setShowContrib(false)
  }

  return (
    <div className={`bg-card border rounded-2xl overflow-hidden ${done ? 'border-green-500/40' : 'border-border'}`}>
      {done && (
        <div className="bg-green-500/10 px-4 py-1.5 text-center">
          <span className="text-xs font-bold text-green-400">🎉 Meta atingida!</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${done ? 'bg-green-500/20' : 'bg-primary/10'}`}>
              <Target size={15} className={done ? 'text-green-400' : 'text-primary'} />
            </div>
            <div>
              <div className="text-sm font-bold text-foreground">{goal.title}</div>
              <div className="text-[11px] text-muted-foreground">Até {formatDate(goal.targetDate)}</div>
            </div>
          </div>
          <button onClick={() => onDelete(goal.id)} className="p-1 text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 size={14} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-foreground font-bold">{formatCurrency(goal.currentAmount, 'BRL')}</span>
            <span className="text-muted-foreground">{formatCurrency(goal.targetAmount, 'BRL')}</span>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: done ? '#22c55e' : pct > 66 ? '#3b82f6' : pct > 33 ? '#f59e0b' : '#ef4444',
              }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>{Math.round(pct)}% concluído</span>
            {!done && <span>Faltam {formatCurrency(remaining, 'BRL')}</span>}
          </div>
        </div>

        {/* Stats */}
        {!done && (
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-muted rounded-xl p-2 text-center">
              <div className="text-[10px] text-muted-foreground">Dias restantes</div>
              <div className={`text-sm font-bold ${daysLeft < 7 ? 'text-red-400' : daysLeft < 30 ? 'text-yellow-400' : 'text-foreground'}`}>
                {Math.max(0, daysLeft)}d
              </div>
            </div>
            <div className="bg-muted rounded-xl p-2 text-center">
              <div className="text-[10px] text-muted-foreground">Poupar/dia</div>
              <div className="text-sm font-bold text-primary">{formatCurrency(dailyNeeded, 'BRL')}</div>
            </div>
          </div>
        )}

        {/* Contribute */}
        {!done && (
          <>
            {showContrib ? (
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">R$</span>
                  <input
                    type="number" inputMode="decimal"
                    value={contrib} onChange={e => setContrib(e.target.value)}
                    placeholder="0,00" autoFocus
                    className="w-full bg-muted border border-border rounded-xl pl-8 pr-3 py-2 text-sm font-bold text-foreground outline-none focus:border-primary"
                  />
                </div>
                <button onClick={handleContrib} disabled={!contrib}
                  className="px-3 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-bold disabled:opacity-40">
                  <Check size={14} />
                </button>
                <button onClick={() => setShowContrib(false)}
                  className="px-3 py-2 bg-muted text-muted-foreground rounded-xl">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button onClick={() => setShowContrib(true)}
                className="w-full py-2 rounded-xl border border-border bg-muted text-muted-foreground text-xs font-semibold hover:border-primary hover:text-primary transition-colors">
                + Adicionar valor
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<NewGoal>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [aiTip, setAiTip] = useState<string | null>(null)
  const [loadingTip, setLoadingTip] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      const data = await api.goals.list() as Goal[]
      setGoals(data)
    } finally {
      setLoading(false)
    }
  }

  async function createGoal() {
    if (!form.title || !form.targetAmount || !form.targetDate) return
    setSaving(true)
    try {
      await api.goals.create({
        title: form.title,
        targetAmount: parseFloat(form.targetAmount),
        targetDate: new Date(form.targetDate).toISOString(),
        currentAmount: 0,
      })
      playTransaction()
      setForm(EMPTY)
      setShowForm(false)
      await load()
    } finally {
      setSaving(false)
    }
  }

  async function contribute(id: string, amount: number) {
    const goal = goals.find(g => g.id === id)
    if (!goal) return
    const newAmount = goal.currentAmount + amount
    await api.goals.update(id, { currentAmount: newAmount })
    if (newAmount >= goal.targetAmount) {
      playGoalReached()
    } else {
      playTransaction()
    }
    setGoals(prev => prev.map(g => g.id === id ? { ...g, currentAmount: newAmount } : g))
  }

  async function deleteGoal(id: string) {
    if (!confirm('Excluir esta meta?')) return
    await api.goals.delete(id)
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  async function getAiTip() {
    setLoadingTip(true)
    try {
      const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0)
      const totalSaved  = goals.reduce((s, g) => s + g.currentAmount, 0)
      const res = await api.ai.chat(
        `Tenho ${goals.length} metas financeiras. Total a atingir: R$${totalTarget.toFixed(2)}, já poupei: R$${totalSaved.toFixed(2)}. Dê uma dica prática de 2 frases para acelerar minhas metas.`
      ) as { reply: string }
      setAiTip(res.reply)
    } finally {
      setLoadingTip(false)
    }
  }

  const activeGoals   = goals.filter(g => g.currentAmount < g.targetAmount)
  const completedGoals = goals.filter(g => g.currentAmount >= g.targetAmount)

  return (
    <div className="max-w-lg mx-auto px-4 pt-5 pb-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <Target size={18} className="text-primary" />
            <h1 className="text-lg font-bold text-foreground">Metas</h1>
          </div>
          <p className="text-xs text-muted-foreground">{goals.length} meta{goals.length !== 1 ? 's' : ''} · {completedGoals.length} concluída{completedGoals.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl">
          <Plus size={14} /> Nova meta
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="bg-card border border-primary/30 rounded-2xl p-4 mb-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Nova meta</div>
          <div className="flex flex-col gap-3">
            <input
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ex: Viagem para Europa"
              className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
            />
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">R$</span>
                <input
                  type="number" inputMode="decimal"
                  value={form.targetAmount} onChange={e => setForm(f => ({ ...f, targetAmount: e.target.value }))}
                  placeholder="Valor alvo"
                  className="w-full bg-muted border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>
              <input
                type="date" value={form.targetDate} onChange={e => setForm(f => ({ ...f, targetDate: e.target.value }))}
                className="bg-muted border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <div className="flex gap-2">
              <button onClick={createGoal} disabled={!form.title || !form.targetAmount || !form.targetDate || saving}
                className="flex-1 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-40">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Criar meta
              </button>
              <button onClick={() => { setShowForm(false); setForm(EMPTY) }}
                className="px-4 py-2.5 bg-muted text-muted-foreground rounded-xl">
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Tip */}
      {goals.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-3 mb-4">
          {aiTip ? (
            <div className="flex gap-2 items-start">
              <Sparkles size={14} className="text-primary mt-0.5 flex-shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">{aiTip}</p>
            </div>
          ) : (
            <button onClick={getAiTip} disabled={loadingTip}
              className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors py-0.5">
              {loadingTip ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
              Pedir dica da IA para acelerar minhas metas
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
      ) : goals.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-3">🎯</div>
          <div className="text-base font-bold text-foreground mb-2">Nenhuma meta ainda</div>
          <p className="text-xs text-muted-foreground mb-4">Crie sua primeira meta financeira — viagem, reserva, investimento.</p>
          <button onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl">
            Criar primeira meta
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {activeGoals.length > 0 && (
            <>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">Em andamento</div>
              {activeGoals.map(g => (
                <GoalCard key={g.id} goal={g} onContribute={contribute} onDelete={deleteGoal} />
              ))}
            </>
          )}
          {completedGoals.length > 0 && (
            <>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mt-2">Concluídas 🎉</div>
              {completedGoals.map(g => (
                <GoalCard key={g.id} goal={g} onContribute={contribute} onDelete={deleteGoal} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
