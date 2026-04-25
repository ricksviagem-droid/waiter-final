import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { Plus, Trash2, ChevronRight, ChevronLeft, DollarSign, Calendar, AlertTriangle, Target, Sparkles } from 'lucide-react'
import { api } from '@/lib/api'
import type { FixedExpense, Event } from '@/types'
import { formatCurrency } from '@/lib/calculations'

const STEPS = ['Bem-vindo', 'Saldo & Moeda', 'Salário', 'Despesas Fixas', 'Zona de Perigo', 'Datas Importantes', 'Pronto!']

const CURRENCIES = ['BRL', 'USD', 'EUR', 'GBP', 'AED', 'CHF']
const EVENT_TYPES = [
  { value: 'vacation', label: '🏖️ Férias' },
  { value: 'bonus', label: '🎁 Bônus esperado' },
  { value: 'contract_end', label: '📋 Fim de contrato' },
  { value: 'other', label: '📅 Outro' },
]

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i <= current ? 'bg-primary w-6' : 'bg-muted w-1.5'
          }`}
        />
      ))}
    </div>
  )
}

export default function OnboardingPage() {
  const { user } = useUser()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  const [currentBalance, setCurrentBalance] = useState('')
  const [currencyMain, setCurrencyMain] = useState('BRL')
  const [currenciesSecondary, setCurrenciesSecondary] = useState<string[]>([])
  const [salaryAmount, setSalaryAmount] = useState('')
  const [salaryDay, setSalaryDay] = useState('5')
  const [loanBalance, setLoanBalance] = useState('')
  const [loanMonthlyPayment, setLoanMonthlyPayment] = useState('')
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([
    { id: '1', label: 'Aluguel', amount: 0, dueDay: 5 },
  ])
  const [dangerZoneThreshold, setDangerZoneThreshold] = useState('500')
  const [events, setEvents] = useState<Omit<Event, 'id' | 'userId' | 'createdAt'>[]>([])

  function toggleSecondary(c: string) {
    setCurrenciesSecondary(prev =>
      prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]
    )
  }

  function addFixedExpense() {
    setFixedExpenses(prev => [
      ...prev,
      { id: Date.now().toString(), label: '', amount: 0, dueDay: undefined },
    ])
  }

  function updateFixedExpense(id: string, field: keyof FixedExpense, value: string | number) {
    setFixedExpenses(prev =>
      prev.map(e => (e.id === id ? { ...e, [field]: value } : e))
    )
  }

  function removeFixedExpense(id: string) {
    setFixedExpenses(prev => prev.filter(e => e.id !== id))
  }

  function addEvent() {
    setEvents(prev => [
      ...prev,
      { title: '', date: '', type: 'other', amountImpact: undefined },
    ])
  }

  function updateEvent(i: number, field: string, value: string | number) {
    setEvents(prev => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)))
  }

  function removeEvent(i: number) {
    setEvents(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleFinish() {
    setSaving(true)
    try {
      await api.settings.save({
        currencyMain,
        currenciesSecondary,
        salaryAmount: parseFloat(salaryAmount) || 0,
        salaryDay: parseInt(salaryDay) || 5,
        loanBalance: parseFloat(loanBalance) || 0,
        loanMonthlyPayment: parseFloat(loanMonthlyPayment) || 0,
        dangerZoneThreshold: parseFloat(dangerZoneThreshold) || 500,
        initialBalance: parseFloat(currentBalance) || 0,
        currentBalance: parseFloat(currentBalance) || 0,
        fixedExpenses,
      })
      for (const ev of events) {
        if (ev.title && ev.date) await api.events.create(ev)
      }
      navigate('/')
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const canNext = () => {
    if (step === 1) return !!currentBalance
    if (step === 2) return !!salaryAmount && !!salaryDay
    return true
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="text-3xl font-black text-primary mb-1">SafeSpend</div>
          <div className="text-sm text-muted-foreground">{STEPS[step]}</div>
        </div>

        <StepIndicator current={step} total={STEPS.length} />

        <div className="mt-6 bg-card border border-border rounded-2xl p-6 min-h-[320px] flex flex-col">

          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="flex flex-col items-center justify-center flex-1 text-center gap-4">
              <div className="text-5xl">👋</div>
              <h2 className="text-xl font-bold text-foreground">
                Olá, {user?.firstName || 'bem-vindo'}!
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Vamos configurar seu perfil financeiro. Leva menos de 2 minutos e você vai saber exatamente quanto pode gastar hoje sem comprometer seu futuro.
              </p>
              <div className="grid grid-cols-3 gap-3 w-full mt-2">
                {[['💰', 'Saldo real'], ['📅', 'Próximo salário'], ['🎯', 'Meta de segurança']].map(([icon, label]) => (
                  <div key={label} className="bg-muted rounded-xl p-3 text-center">
                    <div className="text-xl mb-1">{icon}</div>
                    <div className="text-[11px] text-muted-foreground font-medium">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Balance & Currency */}
          {step === 1 && (
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  <DollarSign size={12} className="inline mr-1" />Saldo atual na conta
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">{currencyMain}</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={currentBalance}
                    onChange={e => setCurrentBalance(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-muted border border-border rounded-xl pl-14 pr-4 py-3 text-lg font-bold text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Moeda principal
                </label>
                <div className="flex gap-2 flex-wrap">
                  {CURRENCIES.map(c => (
                    <button key={c} onClick={() => setCurrencyMain(c)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors ${
                        currencyMain === c
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted border-border text-muted-foreground'
                      }`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Mostrar também em (opcional)
                </label>
                <div className="flex gap-2 flex-wrap">
                  {CURRENCIES.filter(c => c !== currencyMain).map(c => (
                    <button key={c} onClick={() => toggleSecondary(c)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-colors ${
                        currenciesSecondary.includes(c)
                          ? 'bg-accent border-primary text-primary'
                          : 'bg-muted border-border text-muted-foreground'
                      }`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Salary */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Salário mensal líquido
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">{currencyMain}</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={salaryAmount}
                    onChange={e => setSalaryAmount(e.target.value)}
                    placeholder="5000,00"
                    className="w-full bg-muted border border-border rounded-xl pl-14 pr-4 py-3 text-lg font-bold text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  <Calendar size={12} className="inline mr-1" />Dia do mês que recebe
                </label>
                <div className="grid grid-cols-7 gap-1.5">
                  {[1,5,10,15,20,25,30].map(d => (
                    <button key={d} onClick={() => setSalaryDay(String(d))}
                      className={`py-2 rounded-lg text-sm font-bold border transition-colors ${
                        salaryDay === String(d)
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted border-border text-muted-foreground'
                      }`}>
                      {d}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  inputMode="numeric"
                  value={salaryDay}
                  onChange={e => setSalaryDay(e.target.value)}
                  placeholder="Ou digite o dia"
                  className="mt-2 w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
                  Empréstimo ativo? (opcional)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[11px] text-muted-foreground mb-1">Saldo devedor</div>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={loanBalance}
                      onChange={e => setLoanBalance(e.target.value)}
                      placeholder="0"
                      className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <div className="text-[11px] text-muted-foreground mb-1">Parcela mensal</div>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={loanMonthlyPayment}
                      onChange={e => setLoanMonthlyPayment(e.target.value)}
                      placeholder="0"
                      className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Fixed Expenses */}
          {step === 3 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-muted-foreground">Despesas mensais fixas — aluguel, streaming, parcelas, etc.</p>
              <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
                {fixedExpenses.map(exp => (
                  <div key={exp.id} className="flex gap-2 items-center">
                    <input
                      value={exp.label}
                      onChange={e => updateFixedExpense(exp.id, 'label', e.target.value)}
                      placeholder="Ex: Aluguel"
                      className="flex-1 bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                    />
                    <div className="relative w-28">
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">{currencyMain}</span>
                      <input
                        type="number"
                        inputMode="decimal"
                        value={exp.amount || ''}
                        onChange={e => updateFixedExpense(exp.id, 'amount', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full bg-muted border border-border rounded-xl pl-9 pr-2 py-2 text-sm text-foreground outline-none focus:border-primary"
                      />
                    </div>
                    <button onClick={() => removeFixedExpense(exp.id)} className="text-destructive/60 hover:text-destructive">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={addFixedExpense} className="flex items-center gap-2 text-primary text-sm font-semibold mt-1">
                <Plus size={16} /> Adicionar despesa
              </button>
              {fixedExpenses.length > 0 && (
                <div className="mt-2 bg-muted rounded-xl px-4 py-2 flex justify-between text-sm">
                  <span className="text-muted-foreground">Total mensal</span>
                  <span className="font-bold text-foreground">
                    {formatCurrency(fixedExpenses.reduce((s, e) => s + (e.amount || 0), 0), currencyMain)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Danger Zone */}
          {step === 4 && (
            <div className="flex flex-col gap-5">
              <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle size={16} className="text-destructive" />
                  <span className="text-sm font-bold text-destructive">Zona de Perigo</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Este é o valor mínimo de buffer que nunca deve ser tocado. Quando o Safe to Spend cair abaixo deste limite por dia, você recebe um alerta sonoro.
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">
                  <Target size={12} className="inline mr-1" />Buffer mínimo de segurança
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">{currencyMain}</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={dangerZoneThreshold}
                    onChange={e => setDangerZoneThreshold(e.target.value)}
                    className="w-full bg-muted border border-border rounded-xl pl-14 pr-4 py-3 text-lg font-bold text-foreground outline-none focus:border-primary"
                  />
                </div>
                <div className="flex gap-2 mt-3">
                  {['300', '500', '1000', '2000'].map(v => (
                    <button key={v} onClick={() => setDangerZoneThreshold(v)}
                      className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-colors ${
                        dangerZoneThreshold === v
                          ? 'bg-primary text-primary-foreground border-primary'
                          : 'bg-muted border-border text-muted-foreground'
                      }`}>
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Important Dates */}
          {step === 5 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-muted-foreground">Datas que afetam seu planejamento — férias, bônus, fim de contrato.</p>
              <div className="flex flex-col gap-3 max-h-52 overflow-y-auto pr-1">
                {events.map((ev, i) => (
                  <div key={i} className="bg-muted rounded-xl p-3 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <input
                        value={ev.title}
                        onChange={e => updateEvent(i, 'title', e.target.value)}
                        placeholder="Ex: Férias"
                        className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                      />
                      <button onClick={() => removeEvent(i)} className="text-destructive/60 hover:text-destructive">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={ev.type}
                        onChange={e => updateEvent(i, 'type', e.target.value)}
                        className="bg-background border border-border rounded-lg px-2 py-2 text-sm text-foreground outline-none"
                      >
                        {EVENT_TYPES.map(t => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                      <input
                        type="date"
                        value={ev.date}
                        onChange={e => updateEvent(i, 'date', e.target.value)}
                        className="bg-background border border-border rounded-lg px-2 py-2 text-sm text-foreground outline-none"
                      />
                    </div>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={ev.amountImpact ?? ''}
                      onChange={e => updateEvent(i, 'amountImpact', parseFloat(e.target.value) || 0)}
                      placeholder="Impacto financeiro (opcional)"
                      className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                    />
                  </div>
                ))}
              </div>
              <button onClick={addEvent} className="flex items-center gap-2 text-primary text-sm font-semibold">
                <Plus size={16} /> Adicionar data
              </button>
            </div>
          )}

          {/* Step 6: Done */}
          {step === 6 && (
            <div className="flex flex-col items-center justify-center flex-1 text-center gap-4">
              <div className="text-5xl">🎉</div>
              <h2 className="text-xl font-bold text-foreground">Tudo pronto!</h2>
              <div className="bg-muted rounded-xl p-4 w-full text-left space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saldo atual</span>
                  <span className="font-bold text-foreground">{formatCurrency(parseFloat(currentBalance) || 0, currencyMain)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Salário mensal</span>
                  <span className="font-bold text-foreground">{formatCurrency(parseFloat(salaryAmount) || 0, currencyMain)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Despesas fixas</span>
                  <span className="font-bold text-foreground">
                    {formatCurrency(fixedExpenses.reduce((s, e) => s + (e.amount || 0), 0), currencyMain)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buffer de segurança</span>
                  <span className="font-bold text-primary">{formatCurrency(parseFloat(dangerZoneThreshold) || 0, currencyMain)}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                Você pode alterar essas configurações a qualquer momento nas definições.
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-4">
          {step > 0 && (
            <button
              onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft size={18} /> Voltar
            </button>
          )}
          <button
            onClick={step === 6 ? handleFinish : () => setStep(s => s + 1)}
            disabled={!canNext() || saving}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm disabled:opacity-40 transition-opacity"
          >
            {saving ? (
              <span className="animate-spin">⟳</span>
            ) : step === 6 ? (
              <><Sparkles size={16} /> Abrir meu Dashboard</>
            ) : (
              <>Continuar <ChevronRight size={18} /></>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
