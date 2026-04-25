import { useState } from 'react'
import { MessageSquare, Sparkles, Check, Edit2, X, Loader2, ChevronDown } from 'lucide-react'
import { api } from '@/lib/api'
import { playTransaction, playSuccess } from '@/lib/sounds'
import { CATEGORIES, CATEGORY_ICONS } from '@/types'
import { formatCurrency } from '@/lib/calculations'

interface Parsed {
  amount: number
  type: 'debit' | 'credit'
  merchant: string
  category: string
}

const SMS_EXAMPLES = [
  'Compra aprovada R$127,50 SUPERMERCADO EXTRA em 13/04. Saldo: R$1.872,50',
  'Débito R$45,00 em POSTO SHELL. Saldo disponível: R$2.344,00',
  'PIX recebido R$3.200,00 de EMPRESA LTDA. Saldo: R$5.544,00',
  'Pagamento R$89,90 NETFLIX aprovado. Cartão final 4521.',
]

export default function SMSReaderPage() {
  const [smsText, setSmsText] = useState('')
  const [parsed, setParsed] = useState<Parsed | null>(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [showExamples, setShowExamples] = useState(false)
  const [note, setNote] = useState('')

  async function analyze() {
    if (!smsText.trim()) return
    setLoading(true)
    setError('')
    setParsed(null)
    setDone(false)
    try {
      const result = await api.ai.parseSms(smsText) as Parsed
      setParsed(result)
      playTransaction()
    } catch {
      setError('Não consegui analisar esse SMS. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  async function confirm() {
    if (!parsed) return
    setConfirming(true)
    try {
      await api.transactions.create({
        amount: parsed.amount,
        type: parsed.type,
        category: parsed.category,
        merchant: parsed.merchant,
        note,
        source: 'sms',
        rawSms: smsText,
        date: new Date().toISOString(),
      })
      playSuccess()
      setDone(true)
      setSmsText('')
      setParsed(null)
      setNote('')
    } catch {
      setError('Erro ao salvar transação.')
    } finally {
      setConfirming(false)
    }
  }

  function reset() {
    setSmsText('')
    setParsed(null)
    setEditing(false)
    setDone(false)
    setError('')
    setNote('')
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-5 pb-6">

      {/* Header */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare size={18} className="text-primary" />
          <h1 className="text-lg font-bold text-foreground">Leitor de SMS Bancário</h1>
        </div>
        <p className="text-xs text-muted-foreground">Cole a mensagem do banco — a IA extrai o valor, tipo e categoria automaticamente.</p>
      </div>

      {/* Success state */}
      {done && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-5 text-center mb-4">
          <div className="text-3xl mb-2">✅</div>
          <div className="text-sm font-bold text-green-400 mb-1">Transação lançada!</div>
          <p className="text-xs text-muted-foreground mb-3">Saldo e Safe to Spend atualizados.</p>
          <button onClick={reset} className="px-4 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl">
            Analisar outro SMS
          </button>
        </div>
      )}

      {!done && (
        <>
          {/* SMS Input */}
          <div className="bg-card border border-border rounded-2xl p-4 mb-3">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">
              Mensagem do banco
            </label>
            <textarea
              value={smsText}
              onChange={e => setSmsText(e.target.value)}
              placeholder="Cole aqui o SMS do seu banco…"
              rows={4}
              className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary resize-none leading-relaxed"
            />

            {/* Examples toggle */}
            <button
              onClick={() => setShowExamples(v => !v)}
              className="flex items-center gap-1 text-xs text-muted-foreground mt-2 hover:text-foreground transition-colors"
            >
              <ChevronDown size={12} className={`transition-transform ${showExamples ? 'rotate-180' : ''}`} />
              Ver exemplos de SMS
            </button>

            {showExamples && (
              <div className="mt-2 flex flex-col gap-1.5">
                {SMS_EXAMPLES.map((ex, i) => (
                  <button
                    key={i}
                    onClick={() => { setSmsText(ex); setShowExamples(false) }}
                    className="text-left text-xs text-muted-foreground bg-muted border border-border rounded-lg px-3 py-2 hover:border-primary hover:text-foreground transition-colors leading-relaxed"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={analyze}
            disabled={!smsText.trim() || loading}
            className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity mb-4"
          >
            {loading ? <><Loader2 size={16} className="animate-spin" />Analisando com IA…</> : <><Sparkles size={16} />Analisar com IA</>}
          </button>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 mb-3">
              {error}
            </div>
          )}

          {/* Parsed result */}
          {parsed && (
            <div className="bg-card border border-border rounded-2xl overflow-hidden mb-3">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Resultado da IA</span>
                <button
                  onClick={() => setEditing(v => !v)}
                  className="flex items-center gap-1 text-xs text-primary font-semibold"
                >
                  {editing ? <><X size={12} />Fechar</> : <><Edit2 size={12} />Editar</>}
                </button>
              </div>

              <div className="p-4 flex flex-col gap-3">
                {/* Amount */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Valor</span>
                  {editing ? (
                    <input
                      type="number"
                      value={parsed.amount}
                      onChange={e => setParsed(p => p ? { ...p, amount: parseFloat(e.target.value) || 0 } : p)}
                      className="w-32 bg-muted border border-border rounded-lg px-2 py-1 text-sm font-bold text-right text-foreground outline-none focus:border-primary"
                    />
                  ) : (
                    <span className={`text-lg font-black ${parsed.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                      {parsed.type === 'credit' ? '+' : '-'}{formatCurrency(parsed.amount, 'BRL')}
                    </span>
                  )}
                </div>

                {/* Type */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Tipo</span>
                  {editing ? (
                    <div className="flex gap-2">
                      {(['debit', 'credit'] as const).map(t => (
                        <button
                          key={t}
                          onClick={() => setParsed(p => p ? { ...p, type: t } : p)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold border transition-colors ${
                            parsed.type === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-muted border-border text-muted-foreground'
                          }`}
                        >
                          {t === 'debit' ? '💸 Débito' : '💰 Crédito'}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm font-semibold text-foreground">
                      {parsed.type === 'debit' ? '💸 Débito' : '💰 Crédito'}
                    </span>
                  )}
                </div>

                {/* Merchant */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">Estabelecimento</span>
                  {editing ? (
                    <input
                      value={parsed.merchant}
                      onChange={e => setParsed(p => p ? { ...p, merchant: e.target.value } : p)}
                      className="flex-1 bg-muted border border-border rounded-lg px-2 py-1 text-sm text-foreground outline-none focus:border-primary text-right"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-foreground truncate max-w-[60%] text-right">{parsed.merchant || '—'}</span>
                  )}
                </div>

                {/* Category */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs text-muted-foreground">Categoria</span>
                  {editing ? (
                    <select
                      value={parsed.category}
                      onChange={e => setParsed(p => p ? { ...p, category: e.target.value } : p)}
                      className="bg-muted border border-border rounded-lg px-2 py-1 text-sm text-foreground outline-none"
                    >
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-sm font-semibold text-foreground">
                      {CATEGORY_ICONS[parsed.category] || '📦'} {parsed.category}
                    </span>
                  )}
                </div>

                {/* Note */}
                <div>
                  <input
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    placeholder="Observação (opcional)"
                    className="w-full bg-muted border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Confirm button */}
              <div className="px-4 pb-4">
                <button
                  onClick={confirm}
                  disabled={confirming}
                  className="w-full py-3 rounded-xl bg-green-500 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {confirming
                    ? <><Loader2 size={16} className="animate-spin" />Salvando…</>
                    : <><Check size={16} />Confirmar e lançar</>}
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* How it works */}
      <div className="bg-card border border-border rounded-2xl p-4 mt-2">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Como funciona</div>
        <div className="flex flex-col gap-3">
          {[
            ['📋', 'Cole o SMS', 'Copie a mensagem de notificação do seu banco.'],
            ['🤖', 'IA analisa', 'GPT-4o extrai valor, tipo, estabelecimento e categoria.'],
            ['✅', 'Confirme', 'Revise, edite se necessário e confirme o lançamento.'],
            ['🔄', 'Atualiza tudo', 'Saldo e Safe to Spend são recalculados na hora.'],
          ].map(([icon, title, desc]) => (
            <div key={title as string} className="flex items-start gap-3">
              <span className="text-lg mt-0.5">{icon}</span>
              <div>
                <div className="text-sm font-semibold text-foreground">{title as string}</div>
                <div className="text-xs text-muted-foreground">{desc as string}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
