import { useEffect, useState } from 'react'
import { Plus, Filter, Trash2, Edit2, Check, X, Loader2, ChevronDown } from 'lucide-react'
import { api } from '@/lib/api'
import { playTransaction, playSuccess } from '@/lib/sounds'
import { CATEGORIES, CATEGORY_ICONS, type Transaction } from '@/types'
import { formatCurrency, formatDate } from '@/lib/calculations'

const MONTHS = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const now = new Date()

interface NewTx {
  amount: string
  type: 'debit' | 'credit'
  category: string
  merchant: string
  note: string
  date: string
}

const EMPTY_TX: NewTx = {
  amount: '',
  type: 'debit',
  category: 'Outros',
  merchant: '',
  note: '',
  date: new Date().toISOString().slice(0, 10),
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year] = useState(now.getFullYear())
  const [filterType, setFilterType] = useState<'all' | 'debit' | 'credit'>('all')
  const [filterCat, setFilterCat] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<NewTx>(EMPTY_TX)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editCat, setEditCat] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const txs = await api.transactions.list({ month, year }) as Transaction[]
      setTransactions(txs)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [month])

  const filtered = transactions.filter(t => {
    if (filterType !== 'all' && t.type !== filterType) return false
    if (filterCat !== 'all' && t.category !== filterCat) return false
    return true
  })

  const totalDebit  = filtered.filter(t => t.type === 'debit').reduce((s, t) => s + t.amount, 0)
  const totalCredit = filtered.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0)

  async function createTx() {
    if (!form.amount) return
    setSaving(true)
    try {
      await api.transactions.create({
        amount: parseFloat(form.amount),
        type: form.type,
        category: form.category,
        merchant: form.merchant,
        note: form.note,
        source: 'manual',
        date: new Date(form.date).toISOString(),
      })
      playTransaction()
      setShowForm(false)
      setForm(EMPTY_TX)
      await load()
    } finally {
      setSaving(false)
    }
  }

  async function saveCategory(id: string) {
    await api.transactions.update(id, { category: editCat })
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, category: editCat } : t))
    setEditingId(null)
    playSuccess()
  }

  async function deleteTx(id: string) {
    if (!confirm('Excluir esta transação?')) return
    await api.transactions.delete(id)
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  // Group by date
  const grouped = filtered.reduce<Record<string, Transaction[]>>((acc, tx) => {
    const key = tx.date.slice(0, 10)
    if (!acc[key]) acc[key] = []
    acc[key].push(tx)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <div className="max-w-lg mx-auto px-4 pt-5 pb-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-bold text-foreground">Transações</h1>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground text-xs font-bold rounded-xl"
        >
          <Plus size={14} /> Lançar
        </button>
      </div>

      {/* Manual entry form */}
      {showForm && (
        <div className="bg-card border border-primary/30 rounded-2xl p-4 mb-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Lançamento manual</div>
          <div className="flex flex-col gap-3">

            {/* Type toggle */}
            <div className="flex gap-2">
              {(['debit', 'credit'] as const).map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                    form.type === t
                      ? t === 'debit' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-green-500/20 border-green-500/50 text-green-400'
                      : 'bg-muted border-border text-muted-foreground'
                  }`}>
                  {t === 'debit' ? '💸 Débito' : '💰 Crédito'}
                </button>
              ))}
            </div>

            {/* Amount */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm font-bold">R$</span>
              <input
                type="number" inputMode="decimal"
                value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                placeholder="0,00"
                className="w-full bg-muted border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm font-bold text-foreground outline-none focus:border-primary"
              />
            </div>

            {/* Merchant + Category */}
            <div className="grid grid-cols-2 gap-2">
              <input
                value={form.merchant} onChange={e => setForm(f => ({ ...f, merchant: e.target.value }))}
                placeholder="Estabelecimento"
                className="bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
              <select
                value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="bg-muted border border-border rounded-xl px-2 py-2 text-sm text-foreground outline-none"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
              </select>
            </div>

            {/* Date + Note */}
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
              <input
                value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                placeholder="Observação"
                className="bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>

            <div className="flex gap-2">
              <button onClick={createTx} disabled={!form.amount || saving}
                className="flex-1 py-2.5 bg-primary text-primary-foreground text-sm font-bold rounded-xl flex items-center justify-center gap-2 disabled:opacity-40">
                {saving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                Salvar
              </button>
              <button onClick={() => { setShowForm(false); setForm(EMPTY_TX) }}
                className="px-4 py-2.5 bg-muted text-muted-foreground text-sm rounded-xl">
                <X size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Month selector */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 mb-3 scrollbar-hide">
        {MONTHS.map((m, i) => (
          <button key={m} onClick={() => setMonth(i + 1)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              month === i + 1 ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border text-muted-foreground'
            }`}>
            {m}
          </button>
        ))}
      </div>

      {/* Filters */}
      <button onClick={() => setShowFilters(v => !v)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2 hover:text-foreground">
        <Filter size={12} /> Filtros
        <ChevronDown size={12} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
      </button>

      {showFilters && (
        <div className="bg-card border border-border rounded-xl p-3 mb-3 flex flex-col gap-2">
          <div className="flex gap-2">
            {(['all', 'debit', 'credit'] as const).map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                  filterType === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border text-muted-foreground'
                }`}>
                {t === 'all' ? 'Todos' : t === 'debit' ? '💸 Débito' : '💰 Crédito'}
              </button>
            ))}
          </div>
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="bg-muted border border-border rounded-lg px-2 py-1.5 text-xs text-foreground outline-none">
            <option value="all">Todas as categorias</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
          </select>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2">
          <div className="text-[10px] text-red-400/70 font-semibold mb-0.5">SAÍDAS</div>
          <div className="text-sm font-black text-red-400">{formatCurrency(totalDebit, 'BRL')}</div>
        </div>
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-3 py-2">
          <div className="text-[10px] text-green-400/70 font-semibold mb-0.5">ENTRADAS</div>
          <div className="text-sm font-black text-green-400">{formatCurrency(totalCredit, 'BRL')}</div>
        </div>
      </div>

      {/* Transaction list */}
      {loading ? (
        <div className="flex justify-center py-10"><Loader2 size={24} className="animate-spin text-muted-foreground" /></div>
      ) : sortedDates.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <div className="text-3xl mb-2">📭</div>
          <div className="text-sm">Nenhuma transação neste período.</div>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedDates.map(date => (
            <div key={date}>
              <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">
                {formatDate(date)}
              </div>
              <div className="flex flex-col gap-1">
                {grouped[date].map(tx => (
                  <div key={tx.id} className="bg-card border border-border rounded-xl px-3 py-2.5 flex items-center gap-3">
                    <div className="text-xl w-8 text-center flex-shrink-0">{CATEGORY_ICONS[tx.category] || '📦'}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{tx.merchant || tx.category}</div>
                      {editingId === tx.id ? (
                        <div className="flex items-center gap-1 mt-1">
                          <select value={editCat} onChange={e => setEditCat(e.target.value)}
                            className="bg-muted border border-border rounded-lg px-1.5 py-0.5 text-xs text-foreground outline-none flex-1">
                            {CATEGORIES.map(c => <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>)}
                          </select>
                          <button onClick={() => saveCategory(tx.id)} className="text-green-400 hover:text-green-300"><Check size={14} /></button>
                          <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground"><X size={14} /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <span className="text-[11px] text-muted-foreground">{tx.category}</span>
                          {tx.source === 'sms' && <span className="text-[9px] bg-primary/20 text-primary rounded px-1 font-bold">SMS</span>}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                        {tx.type === 'credit' ? '+' : '-'}{formatCurrency(tx.amount, 'BRL')}
                      </span>
                      <div className="flex gap-1">
                        <button onClick={() => { setEditingId(tx.id); setEditCat(tx.category) }}
                          className="p-1 text-muted-foreground hover:text-primary rounded transition-colors">
                          <Edit2 size={13} />
                        </button>
                        <button onClick={() => deleteTx(tx.id)}
                          className="p-1 text-muted-foreground hover:text-destructive rounded transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
