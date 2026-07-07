'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'

const G   = '#4ade80'
const G2  = '#86efac'
const GB  = 'rgba(74,222,128,0.15)'
const GBG = 'rgba(74,222,128,0.06)'
const NAV = '#071828'
const SURF = '#0D2337'
const BORD = '#1A3A52'
const TEXT = '#F0F4F8'
const MUTED = '#7BA3C4'
const RED   = '#f87171'
const REDB  = 'rgba(248,113,113,0.1)'
const AMB   = '#fbbf24'

type Tab = 'calculator' | 'tips'

const EXPENSE_CATEGORIES = [
  { key: 'rent',      label: 'Rent / Housing',     icon: '🏠', placeholder: '1200' },
  { key: 'food',      label: 'Food & Groceries',   icon: '🛒', placeholder: '400' },
  { key: 'transport', label: 'Transport',           icon: '🚌', placeholder: '200' },
  { key: 'utilities', label: 'Bills & Utilities',  icon: '💡', placeholder: '150' },
  { key: 'phone',     label: 'Phone / Internet',   icon: '📱', placeholder: '80' },
  { key: 'other',     label: 'Other Fixed Costs',  icon: '📦', placeholder: '150' },
]

const TIPS_CONTENT = [
  {
    icon: '💰',
    title: 'Treat tips as a bonus, not income',
    body: 'Build your budget on your base salary only. When tips come in, split them: 50% to savings, 50% to spend freely.',
    color: G,
  },
  {
    icon: '🛡️',
    title: 'Emergency fund first',
    body: 'Before anything else, save 3 months of expenses. This is your financial safety net — keeps you from taking bad shifts or bad jobs out of desperation.',
    color: '#38bdf8',
  },
  {
    icon: '📊',
    title: 'The 50/30/20 rule',
    body: '50% of income → needs (rent, food, transport). 30% → wants (eating out, entertainment). 20% → savings & investments.',
    color: '#a78bfa',
  },
  {
    icon: '✈️',
    title: 'Working abroad multiplies your savings',
    body: 'A waiter in Dubai earning AED 7,000/month — with accommodation included — can save 60–70% of their income. In Brazil, it\'s hard to save more than 10–15%.',
    color: AMB,
  },
  {
    icon: '🔄',
    title: 'Automate your savings',
    body: 'Set up an automatic transfer on payday. Move your savings target immediately — you\'ll never "not have enough left over" again.',
    color: '#f472b6',
  },
  {
    icon: '📈',
    title: 'Invest in your skill = best ROI',
    body: 'Every R$50 spent on English training, POS certification, or sommelier courses can add R$500–2,000/month to your earning potential within a year.',
    color: G,
  },
]

function fmt(n: number) {
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

function Bar({ pct, color, label }: { pct: number; color: string; label: string }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 10, color: MUTED }}>{label}</span>
        <span style={{ fontSize: 10, color, fontWeight: 700 }}>{Math.round(pct)}%</span>
      </div>
      <div style={{ height: 6, background: BORD, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${Math.min(pct, 100)}%`,
          background: color,
          borderRadius: 3,
          transition: 'width 0.4s ease',
        }} />
      </div>
    </div>
  )
}

export default function SafeToSpendPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('calculator')
  const [baseSalary, setBaseSalary] = useState('')
  const [tips, setTips] = useState('')
  const [expenses, setExpenses] = useState<Record<string, string>>({})

  const numbers = useMemo(() => {
    const income = (parseFloat(baseSalary) || 0) + (parseFloat(tips) || 0)
    const totalExpenses = EXPENSE_CATEGORIES.reduce((sum, c) => sum + (parseFloat(expenses[c.key]) || 0), 0)
    const safeToSpend = Math.max(0, income - totalExpenses)
    const recommended50 = income * 0.5
    const recommended20savings = income * 0.2
    const recommended30wants = income * 0.3
    const needsPct   = income > 0 ? (totalExpenses / income) * 100 : 0
    const savingsPct = income > 0 ? (recommended20savings / income) * 100 : 20
    const wantsPct   = income > 0 ? Math.max(0, ((income - totalExpenses - recommended20savings) / income) * 100) : 30
    const overBudget = totalExpenses > recommended50
    const healthScore = income > 0
      ? Math.max(0, Math.min(100, Math.round(100 - (needsPct - 50) * 2)))
      : 0
    return { income, totalExpenses, safeToSpend, recommended20savings, recommended30wants, needsPct, savingsPct, wantsPct, overBudget, healthScore, recommended50 }
  }, [baseSalary, tips, expenses])

  const hasInput = numbers.income > 0

  return (
    <>
      <style>{`
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)} }
        @keyframes countUp { from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; background:${NAV}; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:${BORD}; border-radius:3px; }
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button { -webkit-appearance:none; }
        input[type=number] { -moz-appearance:textfield; }
      `}</style>

      <div style={{
        minHeight: '100dvh', background: NAV,
        fontFamily: 'var(--font-geist-sans, system-ui, sans-serif)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: '100%', maxWidth: 430, height: '100dvh', maxHeight: 900,
          background: SURF, display: 'flex', flexDirection: 'column',
          border: `1px solid ${BORD}`, overflow: 'hidden',
        }}>

          {/* Header */}
          <div style={{
            background: NAV, borderBottom: `1px solid ${BORD}`,
            padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
          }}>
            <button onClick={() => router.push('/')} style={{
              background: 'transparent', border: 'none', color: MUTED,
              cursor: 'pointer', fontSize: 18, padding: 0, lineHeight: 1,
            }}>←</button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: TEXT }}>💚 Safe to Spend</div>
              <div style={{ fontSize: 10, color: MUTED }}>Income · Expenses · What you can spend</div>
            </div>
            {hasInput && (
              <div style={{
                fontSize: 11, fontWeight: 800,
                color: numbers.overBudget ? RED : G,
                background: numbers.overBudget ? REDB : GB,
                border: `1px solid ${numbers.overBudget ? RED + '40' : G + '40'}`,
                borderRadius: 8, padding: '4px 10px',
              }}>
                {numbers.overBudget ? '⚠️ Over' : `R$${fmt(numbers.safeToSpend)}`}
              </div>
            )}
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: `1px solid ${BORD}`,
            background: NAV, flexShrink: 0,
          }}>
            {(['calculator', 'tips'] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer',
                background: 'transparent', fontSize: 11, fontWeight: 700, letterSpacing: 1,
                textTransform: 'uppercase',
                color: tab === t ? G : MUTED,
                borderBottom: `2px solid ${tab === t ? G : 'transparent'}`,
                transition: 'all 0.15s',
              }}>
                {t === 'calculator' ? '🧮 Calculator' : '💡 Smart Tips'}
              </button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: 'auto' }}>

            {tab === 'calculator' && (
              <div style={{ padding: '16px', animation: 'fadeIn 0.3s ease' }}>

                {/* Income Section */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: G, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>
                    YOUR MONTHLY INCOME
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { key: 'base', label: '💼 Base Salary', value: baseSalary, set: setBaseSalary, ph: '2500' },
                      { key: 'tips', label: '🪙 Tips (avg/month)', value: tips, set: setTips, ph: '800' },
                    ].map(({ key, label, value, set, ph }) => (
                      <div key={key} style={{
                        background: NAV, border: `1px solid ${BORD}`,
                        borderRadius: 10, padding: '10px 14px',
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}>
                        <span style={{ fontSize: 12, color: MUTED, flex: 1 }}>{label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontSize: 12, color: MUTED }}>R$</span>
                          <input
                            type="number"
                            inputMode="decimal"
                            value={value}
                            onChange={e => set(e.target.value)}
                            placeholder={ph}
                            style={{
                              width: 80, background: 'transparent', border: 'none',
                              color: TEXT, fontSize: 14, fontWeight: 700,
                              textAlign: 'right', outline: 'none',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {hasInput && (
                    <div style={{
                      marginTop: 8, background: GB, border: `1px solid ${G}30`,
                      borderRadius: 10, padding: '10px 14px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span style={{ fontSize: 11, color: G2 }}>Total monthly income</span>
                      <span style={{ fontSize: 16, fontWeight: 900, color: G }}>R${fmt(numbers.income)}</span>
                    </div>
                  )}
                </div>

                {/* Expenses Section */}
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 10, color: MUTED, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>
                    MONTHLY EXPENSES
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {EXPENSE_CATEGORIES.map(cat => (
                      <div key={cat.key} style={{
                        background: NAV, border: `1px solid ${BORD}`,
                        borderRadius: 10, padding: '10px 14px',
                        display: 'flex', alignItems: 'center', gap: 10,
                      }}>
                        <span style={{ fontSize: 14, flexShrink: 0 }}>{cat.icon}</span>
                        <span style={{ fontSize: 11, color: MUTED, flex: 1 }}>{cat.label}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ fontSize: 11, color: MUTED }}>R$</span>
                          <input
                            type="number"
                            inputMode="decimal"
                            value={expenses[cat.key] || ''}
                            onChange={e => setExpenses(prev => ({ ...prev, [cat.key]: e.target.value }))}
                            placeholder={cat.placeholder}
                            style={{
                              width: 80, background: 'transparent', border: 'none',
                              color: TEXT, fontSize: 13, fontWeight: 700,
                              textAlign: 'right', outline: 'none',
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {numbers.totalExpenses > 0 && (
                    <div style={{
                      marginTop: 8, background: REDB, border: `1px solid ${RED}30`,
                      borderRadius: 10, padding: '10px 14px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span style={{ fontSize: 11, color: RED }}>Total monthly expenses</span>
                      <span style={{ fontSize: 15, fontWeight: 900, color: RED }}>R${fmt(numbers.totalExpenses)}</span>
                    </div>
                  )}
                </div>

                {/* Results */}
                {hasInput && (
                  <div style={{ animation: 'fadeIn 0.35s ease' }}>
                    <div style={{ fontSize: 10, color: MUTED, fontWeight: 700, letterSpacing: 2, marginBottom: 10 }}>
                      YOUR RESULTS
                    </div>

                    {/* Safe to Spend hero */}
                    <div style={{
                      background: numbers.overBudget
                        ? `linear-gradient(135deg,${REDB},rgba(0,0,0,0.2))`
                        : `linear-gradient(135deg,${GBG},rgba(0,0,0,0.2))`,
                      border: `1px solid ${numbers.overBudget ? RED + '40' : G + '40'}`,
                      borderRadius: 14, padding: '18px', marginBottom: 12,
                      position: 'relative', overflow: 'hidden', textAlign: 'center',
                    }}>
                      <div style={{
                        position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                        background: `linear-gradient(90deg,transparent,${numbers.overBudget ? RED : G},transparent)`,
                      }} />
                      <div style={{ fontSize: 10, color: numbers.overBudget ? RED : G, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>
                        {numbers.overBudget ? '⚠️ OVER BUDGET' : '✅ SAFE TO SPEND'}
                      </div>
                      <div style={{
                        fontSize: 38, fontWeight: 900,
                        color: numbers.overBudget ? RED : G,
                        lineHeight: 1, marginBottom: 4,
                        animation: 'countUp 0.4s ease',
                      }}>
                        R${fmt(numbers.safeToSpend)}
                      </div>
                      <div style={{ fontSize: 11, color: MUTED }}>
                        {numbers.overBudget
                          ? `Your expenses exceed your income by R$${fmt(numbers.totalExpenses - numbers.income)}`
                          : 'discretionary budget remaining this month'}
                      </div>
                    </div>

                    {/* Recommended split */}
                    {!numbers.overBudget && (
                      <div style={{
                        background: NAV, border: `1px solid ${BORD}`,
                        borderRadius: 12, padding: '14px', marginBottom: 12,
                      }}>
                        <div style={{ fontSize: 10, color: G, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>
                          SUGGESTED SPLIT (50/30/20)
                        </div>
                        {[
                          { label: '🏠 Needs (50%)', amount: numbers.recommended50, color: '#38bdf8', desc: 'rent, food, bills' },
                          { label: '🎉 Wants (30%)', amount: numbers.recommended30wants, color: AMB, desc: 'dining out, fun, treats' },
                          { label: '💰 Savings (20%)', amount: numbers.recommended20savings, color: G, desc: 'future, emergency fund' },
                        ].map(({ label, amount, color, desc }) => (
                          <div key={label} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '8px 0', borderBottom: `1px solid ${BORD}`,
                          }}>
                            <div>
                              <div style={{ fontSize: 12, color: TEXT, fontWeight: 600 }}>{label}</div>
                              <div style={{ fontSize: 10, color: MUTED }}>{desc}</div>
                            </div>
                            <span style={{ fontSize: 14, fontWeight: 800, color }}> R${fmt(amount)}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Budget health bars */}
                    <div style={{
                      background: NAV, border: `1px solid ${BORD}`,
                      borderRadius: 12, padding: '14px', marginBottom: 12,
                    }}>
                      <div style={{ fontSize: 10, color: MUTED, fontWeight: 700, letterSpacing: 2, marginBottom: 12 }}>
                        BUDGET HEALTH
                      </div>
                      <Bar pct={numbers.needsPct} color={numbers.needsPct > 60 ? RED : numbers.needsPct > 50 ? AMB : '#38bdf8'} label="Needs (target ≤ 50%)" />
                      <Bar pct={Math.min(20, (numbers.income > 0 ? (numbers.recommended20savings / numbers.income) * 100 : 0))} color={G} label="Savings (target ≥ 20%)" />
                      <div style={{ marginTop: 10, padding: '8px 12px', background: SURF, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 11, color: MUTED }}>Financial health score</span>
                        <span style={{
                          fontSize: 13, fontWeight: 900,
                          color: numbers.healthScore >= 70 ? G : numbers.healthScore >= 40 ? AMB : RED,
                        }}>
                          {numbers.healthScore}/100
                        </span>
                      </div>
                    </div>

                    {/* Abroad comparison teaser */}
                    <div style={{
                      background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)',
                      borderRadius: 12, padding: '14px', marginBottom: 24,
                    }}>
                      <div style={{ fontSize: 10, color: AMB, fontWeight: 700, letterSpacing: 2, marginBottom: 8 }}>
                        ✈️ WHAT IF YOU WORKED ABROAD?
                      </div>
                      <p style={{ fontSize: 11, color: MUTED, lineHeight: 1.6, marginBottom: 10 }}>
                        In Dubai, a waiter earns the equivalent of <strong style={{ color: AMB }}>R${fmt(10000)}+/month</strong> — tax-free, with rent and flights covered. That&apos;s a safe-to-spend of <strong style={{ color: AMB }}>R${fmt(7000)}+</strong> every month.
                      </p>
                      <button onClick={() => router.push('/work-abroad')} style={{
                        width: '100%', padding: '10px', borderRadius: 10,
                        border: '1px solid rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.08)',
                        color: AMB, fontSize: 11, fontWeight: 800, cursor: 'pointer', letterSpacing: 1,
                      }}>
                        SEE SALARIES ABROAD →
                      </button>
                    </div>
                  </div>
                )}

                {!hasInput && (
                  <div style={{ textAlign: 'center', padding: '24px 0', color: MUTED, fontSize: 12, animation: 'fadeIn 0.4s ease' }}>
                    <div style={{ fontSize: 32, marginBottom: 10 }}>💚</div>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>Enter your income above</div>
                    <div style={{ fontSize: 11, lineHeight: 1.6 }}>Add your salary and expenses to see exactly how much you can safely spend this month.</div>
                  </div>
                )}
              </div>
            )}

            {tab === 'tips' && (
              <div style={{ padding: '16px', animation: 'fadeIn 0.3s ease' }}>
                <div style={{
                  background: GB, border: `1px solid ${G}30`,
                  borderRadius: 14, padding: '16px', marginBottom: 16,
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${G},transparent)` }} />
                  <div style={{ fontSize: 11, fontWeight: 700, color: G, marginBottom: 4 }}>Financial intelligence for hospitality pros</div>
                  <p style={{ fontSize: 11, color: MUTED, lineHeight: 1.6, margin: 0 }}>
                    Most waiters earn decent money but save very little. These principles will change that.
                  </p>
                </div>

                {TIPS_CONTENT.map((tip, i) => (
                  <div key={i} style={{
                    background: NAV, border: `1px solid ${BORD}`,
                    borderLeft: `3px solid ${tip.color}`,
                    borderRadius: 12, padding: '14px', marginBottom: 10,
                    animation: `fadeIn 0.35s ${i * 0.05}s ease both`,
                  }}>
                    <div style={{ display: 'flex', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 20, flexShrink: 0 }}>{tip.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: TEXT, lineHeight: 1.3 }}>{tip.title}</span>
                    </div>
                    <p style={{ fontSize: 11, color: MUTED, lineHeight: 1.65, margin: 0 }}>{tip.body}</p>
                  </div>
                ))}

                <div style={{ paddingBottom: 24 }}>
                  <button onClick={() => setTab('calculator')} style={{
                    width: '100%', padding: '14px', borderRadius: 12, border: 'none',
                    background: `linear-gradient(135deg,${G},#16a34a)`,
                    color: '#071828', fontSize: 13, fontWeight: 900, cursor: 'pointer', letterSpacing: 1,
                  }}>
                    CALCULATE MY BUDGET →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
