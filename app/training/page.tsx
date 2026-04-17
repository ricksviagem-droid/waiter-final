'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

type Role = 'user' | 'assistant'

type ChatMessage = {
  role: Role
  text: string
}

type AIMessage = {
  role: 'user' | 'assistant'
  content: string
}

type TurnFeedback = {
  title: string
  message: string
  betterPhrase: string
  strikeAdded: boolean
  pointsDelta: number
}

type FinalReport = {
  overallScore: number
  english: number
  professionalism: number
  timing: number
  guestImpact: number
  verdict: string
  strengths: string[]
  improvements: string[]
  betterPhrase: string
  summary: string
}

const TURN_TIME = 30
const MAX_STRIKES = 3
const TARGET_GOOD_TURNS = 5

const G = '#c9a84c'
const GOLD_BORDER = 'rgba(201,168,76,0.22)'
const GOLD_BG = 'rgba(201,168,76,0.06)'
const DARK = '#07050b'
const PANEL = '#0d0b08'
const CREAM = '#f4f0e8'
const MUTED = '#9a8868'

export default function Home() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', text: 'Good evening.' },
  ])
  const [conversation, setConversation] = useState<AIMessage[]>([
    { role: 'assistant', content: 'Good evening.' },
  ])

  const [timeLeft, setTimeLeft] = useState(TURN_TIME)
  const [isWaitingForAI, setIsWaitingForAI] = useState(false)
  const [sessionEnded, setSessionEnded] = useState(false)

  const [strikes, setStrikes] = useState(0)
  const [goodTurns, setGoodTurns] = useState(0)
  const [score, setScore] = useState(0)
  const [mood, setMood] = useState<'friendly' | 'neutral' | 'annoyed'>('neutral')
  const [endReason, setEndReason] = useState('')

  const [lastFeedback, setLastFeedback] = useState<TurnFeedback | null>(null)
  const [turnFeedbacks, setTurnFeedbacks] = useState<TurnFeedback[]>([])
  const [report, setReport] = useState<FinalReport | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)

  const chatRef = useRef<HTMLDivElement>(null)

  const medal = useMemo(() => {
    if (strikes >= MAX_STRIKES) return 'None'
    if (score >= 18 && strikes === 0) return 'Gold'
    if (score >= 12 && strikes <= 1) return 'Silver'
    if (score >= 7) return 'Bronze'
    return 'None'
  }, [score, strikes])

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, lastFeedback, report])

  useEffect(() => {
    if (sessionEnded || isWaitingForAI) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); void handleTimeout(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionEnded, isWaitingForAI, conversation])

  function getMood(nextStrikes: number, currentScore: number): 'friendly' | 'neutral' | 'annoyed' {
    if (nextStrikes >= 2) return 'annoyed'
    if (currentScore >= 8 && nextStrikes === 0) return 'friendly'
    return 'neutral'
  }

  function evaluateTurn(text: string, currentTimeLeft: number, currentMood: string): TurnFeedback {
    const normalized = text.trim().toLowerCase()
    const wordCount = normalized.split(/\s+/).filter(Boolean).length

    const hasGreeting = /(good evening|good afternoon|welcome)/i.test(text)
    const hasPoliteLanguage = /(sir|madam|please|thank you|certainly|of course)/i.test(text)
    const hasIntroduction = /(my name is|i will be taking care of you|i'll be taking care of you)/i.test(text)
    const hasServiceIntent = /(drink|water|cocktail|wine|menu|reservation|table|special)/i.test(text)
    const hasApology = /(sorry|apologize|apologise)/i.test(text)
    const tooCasual = /(hey guys|yo|bro|what do you want|hurry up)/i.test(text)
    const tooShort = wordCount < 4

    let strikeAdded = false
    let pointsDelta = 0
    let title = 'Solid response'
    let message = 'You kept the interaction moving.'
    let betterPhrase = 'Good evening, sir. Welcome to Grand Lux Café. My name is Ned and I will be taking care of you tonight.'

    if (tooCasual) {
      strikeAdded = true; pointsDelta = -2; title = 'Too casual'
      message = 'Your tone was too informal for a luxury dining context.'
      betterPhrase = 'Good evening, sir. Welcome to Grand Lux Café. How may I assist you this evening?'
      return { title, message, betterPhrase, strikeAdded, pointsDelta }
    }
    if (tooShort) {
      strikeAdded = true; pointsDelta = -1; title = 'Too short'
      message = 'Your response was too limited and did not feel like professional service.'
      betterPhrase = 'Good evening, sir. Welcome to Grand Lux Café. My name is Ned and I will be taking care of you tonight.'
      return { title, message, betterPhrase, strikeAdded, pointsDelta }
    }
    if (currentMood === 'annoyed' && !hasApology) {
      strikeAdded = true; pointsDelta = -1; title = 'Missed recovery'
      message = 'The guest was already upset. You should have acknowledged the issue and recovered the situation.'
      betterPhrase = 'I sincerely apologize for the delay, sir. Thank you for your patience. How may I assist you now?'
      return { title, message, betterPhrase, strikeAdded, pointsDelta }
    }

    if (hasGreeting) pointsDelta += 2
    if (hasPoliteLanguage) pointsDelta += 2
    if (hasIntroduction) pointsDelta += 2
    if (hasServiceIntent) pointsDelta += 2
    if (hasApology) pointsDelta += 1
    if (currentTimeLeft <= 5) pointsDelta -= 1

    if (pointsDelta >= 6) {
      title = 'Strong service move'
      message = 'Good tone, role-appropriate language, and clear service intent.'
      betterPhrase = text
    } else if (pointsDelta >= 3) {
      title = 'Good, but can be stronger'
      message = 'Your response worked, but it could sound more polished for fine dining.'
      betterPhrase = 'Good evening, sir. My name is Ned and I will be taking care of you tonight. May I offer you still or sparkling water to begin?'
    } else {
      title = 'Weak hospitality language'
      message = 'You responded, but the phrasing did not fully match a luxury service standard.'
      betterPhrase = 'Good evening, sir. Welcome. My name is Ned and I will be taking care of you tonight.'
    }

    return { title, message, betterPhrase, strikeAdded, pointsDelta }
  }

  async function handleTimeout() {
    if (sessionEnded || isWaitingForAI) return
    const nextStrikes = strikes + 1
    const nextScore = Math.max(score - 2, 0)
    setStrikes(nextStrikes); setScore(nextScore); setMood(getMood(nextStrikes, nextScore))

    const feedback: TurnFeedback = {
      title: 'Timeout', strikeAdded: true, pointsDelta: -2,
      message: 'You did not answer in time. In real service, silence damages the guest experience.',
      betterPhrase: 'I sincerely apologize for the wait, sir. Thank you for your patience.',
    }
    setLastFeedback(feedback); setTurnFeedbacks((prev) => [...prev, feedback])

    if (nextStrikes >= MAX_STRIKES) {
      const line = "This is unacceptable. Please call the manager. We're leaving."
      setMessages((prev) => [...prev, { role: 'assistant', text: line }])
      setConversation((prev) => [...prev, { role: 'assistant', content: line }])
      setSessionEnded(true); setEndReason('Game Over — 3 service failures. The guest left.')
      setIsWaitingForAI(false); setTimeLeft(0); return
    }

    setIsWaitingForAI(true)
    const tc: AIMessage[] = [...conversation, { role: 'user', content: 'The waiter stayed silent too long and failed to respond in time.' }]
    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: tc }) })
      const data = await res.json()
      setConversation([...tc, { role: 'assistant', content: data.response }])
      setMessages((prev) => [...prev, { role: 'assistant', text: data.response }])
    } finally { setIsWaitingForAI(false); setTimeLeft(TURN_TIME) }
  }

  async function handleSend() {
    if (!input.trim() || sessionEnded || isWaitingForAI) return
    const currentInput = input.trim()
    setInput(''); setIsWaitingForAI(true)

    const feedback = evaluateTurn(currentInput, timeLeft, mood)
    const nextStrikes = feedback.strikeAdded ? strikes + 1 : strikes
    const nextScore = Math.max(score + feedback.pointsDelta, 0)
    const nextGoodTurns = feedback.strikeAdded ? goodTurns : goodTurns + 1
    const nextMood = getMood(nextStrikes, nextScore)

    setLastFeedback(feedback); setTurnFeedbacks((prev) => [...prev, feedback])
    setStrikes(nextStrikes); setScore(nextScore); setGoodTurns(nextGoodTurns); setMood(nextMood)
    setMessages((prev) => [...prev, { role: 'user', text: currentInput }])

    const newConv: AIMessage[] = [...conversation, { role: 'user', content: currentInput }]

    if (nextStrikes >= MAX_STRIKES) {
      const line = 'This is not the standard I expect here. Please call the manager.'
      setMessages((prev) => [...prev, { role: 'assistant', text: line }])
      setConversation([...newConv, { role: 'assistant', content: line }])
      setSessionEnded(true); setEndReason('Game Over — 3 errors. The guest requested the manager.')
      setIsWaitingForAI(false); setTimeLeft(0); return
    }
    if (nextGoodTurns >= TARGET_GOOD_TURNS) {
      const line = 'Thank you. That was much better.'
      setMessages((prev) => [...prev, { role: 'assistant', text: line }])
      setConversation([...newConv, { role: 'assistant', content: line }])
      setSessionEnded(true); setEndReason('Success — You completed the first service round.')
      setIsWaitingForAI(false); setTimeLeft(0); return
    }

    try {
      const res = await fetch('/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newConv }) })
      const data = await res.json()
      setConversation([...newConv, { role: 'assistant', content: data.response }])
      setMessages((prev) => [...prev, { role: 'assistant', text: data.response }])
    } finally { setIsWaitingForAI(false); setTimeLeft(TURN_TIME) }
  }

  async function handleEvaluate() {
    if (isEvaluating) return
    setIsEvaluating(true)
    try {
      const res = await fetch('/api/ai/evaluate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation, stats: { score, strikes, goodTurns, sessionEnded, endReason, medal }, turnFeedbacks }),
      })
      const data = await res.json()
      setReport(data.report)
    } finally { setIsEvaluating(false) }
  }

  function handleReset() {
    setInput(''); setMessages([{ role: 'assistant', text: 'Good evening.' }])
    setConversation([{ role: 'assistant', content: 'Good evening.' }])
    setTimeLeft(TURN_TIME); setIsWaitingForAI(false); setSessionEnded(false)
    setStrikes(0); setGoodTurns(0); setScore(0); setMood('neutral'); setEndReason('')
    setLastFeedback(null); setTurnFeedbacks([]); setReport(null)
  }

  const timerColor = timeLeft > 15 ? G : timeLeft > 8 ? '#d4820a' : '#c45050'
  const moodIcon = mood === 'friendly' ? '😊' : mood === 'annoyed' ? '😠' : '😐'

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a1f0a; border-radius: 4px; }
      `}</style>

      <div style={{ minHeight: '100dvh', background: `linear-gradient(160deg,${DARK} 0%,#100d07 50%,${DARK} 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-geist-sans,Arial,sans-serif)' }}>
        <div style={{ width: '100%', maxWidth: 520, minHeight: '100dvh', background: PANEL, display: 'flex', flexDirection: 'column', border: '1px solid ' + GOLD_BORDER, boxShadow: '0 0 60px rgba(201,168,76,0.06)' }}>

          {/* Header */}
          <div style={{ background: 'rgba(10,8,5,0.98)', borderBottom: '1px solid ' + GOLD_BORDER, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: CREAM, letterSpacing: 1 }}>Luxury Training</span>
                  <span style={{ fontSize: 9, color: G, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 4, padding: '1px 6px', fontWeight: 700, letterSpacing: 1 }}>CHAT</span>
                </div>
                <div style={{ fontSize: 11, color: MUTED, marginTop: 2 }}>Professional Waiter · Phase 1</div>
              </div>
              <a href="/shift" style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 11px', borderRadius: 20, background: 'linear-gradient(135deg,#c9a84c,#8b6914)', color: '#07050b', fontSize: 10, fontWeight: 800, textDecoration: 'none', letterSpacing: 1, whiteSpace: 'nowrap' }}>
                ⚡ SHIFT
              </a>
            </div>
            <div style={{ display: 'flex', gap: 10, fontSize: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <span style={{ color: timerColor, fontWeight: 700 }}>⏱ {timeLeft}s</span>
              <span style={{ color: '#c8b88a' }}>{moodIcon} {mood}</span>
              <span style={{ color: strikes > 0 ? '#c45050' : MUTED }}>✕ {strikes}/{MAX_STRIKES}</span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, padding: '10px 12px' }}>
            {[
              { label: 'Progress', value: `${goodTurns}/${TARGET_GOOD_TURNS}` },
              { label: 'Score', value: score },
              { label: 'Medal', value: medal },
            ].map(({ label, value }) => (
              <div key={label} style={{ background: GOLD_BG, border: '1px solid ' + GOLD_BORDER, borderRadius: 12, padding: '9px 10px' }}>
                <div style={{ fontSize: 10, color: MUTED }}>{label}</div>
                <div style={{ marginTop: 3, fontSize: 16, fontWeight: 800, color: CREAM }}>{value}</div>
              </div>
            ))}
          </div>

          {/* End banner */}
          {sessionEnded && (
            <div style={{ margin: '0 12px 10px', padding: '11px 14px', background: endReason.startsWith('Success') ? 'rgba(34,197,94,0.08)' : 'rgba(196,80,80,0.1)', border: `1px solid ${endReason.startsWith('Success') ? '#22c55e' : '#c45050'}`, borderRadius: 12, animation: 'fadeUp 0.3s ease' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: endReason.startsWith('Success') ? '#4ade80' : '#fca5a5' }}>{endReason}</span>
            </div>
          )}

          {/* Turn feedback */}
          {lastFeedback && (
            <div style={{ margin: '0 12px 10px', padding: '11px 14px', background: GOLD_BG, borderRadius: 12, border: '1px solid ' + GOLD_BORDER, animation: 'fadeUp 0.3s ease' }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: G, marginBottom: 4, letterSpacing: 0.5 }}>
                {lastFeedback.strikeAdded ? '✕' : '✓'} {lastFeedback.title}
              </div>
              <div style={{ fontSize: 12, color: '#c8b88a', marginBottom: 5, lineHeight: 1.5 }}>{lastFeedback.message}</div>
              <div style={{ fontSize: 12, color: G, fontStyle: 'italic', lineHeight: 1.5 }}>
                Better: "{lastFeedback.betterPhrase}"
              </div>
            </div>
          )}

          {/* Chat area */}
          <div ref={chatRef} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10, overflowY: 'auto', padding: '0 12px 12px' }}>
            {messages.map((msg, i) => {
              const isUser = msg.role === 'user'
              return (
                <div key={i} style={{
                  padding: '11px 14px', borderRadius: 14, maxWidth: '82%', fontSize: 14, lineHeight: 1.45, whiteSpace: 'pre-wrap',
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  background: isUser ? 'rgba(201,168,76,0.1)' : 'rgba(255,255,255,0.04)',
                  border: isUser ? '1px solid rgba(201,168,76,0.28)' : '1px solid rgba(255,255,255,0.07)',
                  color: isUser ? '#e8d090' : '#c8b88a',
                  animation: 'fadeUp 0.2s ease',
                }}>
                  {msg.text}
                </div>
              )
            })}
            {isWaitingForAI && (
              <div style={{ fontSize: 12, color: MUTED, textAlign: 'center', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                <div style={{ width: 14, height: 14, border: `2px solid ${G}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                Guest is responding…
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, padding: '0 12px 10px' }}>
            <button onClick={handleEvaluate} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid ' + GOLD_BORDER, background: GOLD_BG, color: G, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              {isEvaluating ? '…' : '📋 Evaluate'}
            </button>
            <button onClick={handleReset} style={{ flex: 1, padding: '11px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)', color: MUTED, fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
              ↺ Restart
            </button>
          </div>

          {/* Input bar */}
          <div style={{ display: 'flex', gap: 8, padding: '12px', background: 'rgba(10,8,5,0.98)', borderTop: '1px solid ' + GOLD_BORDER, position: 'sticky', bottom: 0 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); void handleSend() } }}
              placeholder={sessionEnded ? 'Session ended' : 'Type as waiter…'}
              disabled={sessionEnded || isWaitingForAI}
              style={{ flex: 1, padding: '12px 16px', borderRadius: 24, border: '1px solid ' + GOLD_BORDER, outline: 'none', background: 'rgba(20,15,8,0.8)', color: CREAM, fontSize: 14, fontFamily: 'inherit' }}
            />
            <button
              onClick={() => void handleSend()}
              disabled={sessionEnded || isWaitingForAI}
              style={{ width: 50, height: 50, borderRadius: '50%', border: 'none', background: 'linear-gradient(135deg,#c9a84c,#8b6914)', color: '#07050b', fontWeight: 900, fontSize: 18, cursor: 'pointer', flexShrink: 0, boxShadow: '0 0 16px rgba(201,168,76,0.3)' }}
            >
              ➤
            </button>
          </div>

          {/* AI Report */}
          {report && (
            <div style={{ margin: 12, padding: 16, background: GOLD_BG, borderRadius: 14, border: '1px solid ' + GOLD_BORDER, animation: 'fadeUp 0.3s ease' }}>
              <div style={{ fontSize: 15, fontWeight: 800, color: G, marginBottom: 12, letterSpacing: 0.5 }}>AI Performance Report</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13, marginBottom: 12 }}>
                {[
                  ['Overall', report.overallScore],
                  ['English', report.english],
                  ['Professionalism', report.professionalism],
                  ['Timing', report.timing],
                  ['Guest Impact', report.guestImpact],
                  ['Verdict', report.verdict],
                ].map(([k, v]) => (
                  <div key={k as string} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '7px 10px' }}>
                    <div style={{ fontSize: 10, color: MUTED, marginBottom: 2 }}>{k}</div>
                    <div style={{ color: CREAM, fontWeight: 700 }}>{v}</div>
                  </div>
                ))}
              </div>
              {[
                { label: 'Strengths', items: report.strengths, color: '#4ade80' },
                { label: 'Improvements', items: report.improvements, color: '#fbbf24' },
              ].map(({ label, items, color }) => (
                <div key={label} style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color, marginBottom: 5 }}>{label}</div>
                  <ul style={{ paddingLeft: 16, margin: 0 }}>
                    {items.map((item, i) => <li key={i} style={{ fontSize: 13, color: '#c8b88a', lineHeight: 1.5 }}>{item}</li>)}
                  </ul>
                </div>
              ))}
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: G, marginBottom: 4 }}>Better phrase</div>
                <div style={{ fontSize: 13, color: '#c8b88a', fontStyle: 'italic', lineHeight: 1.5 }}>"{report.betterPhrase}"</div>
              </div>
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: G, marginBottom: 4 }}>Summary</div>
                <div style={{ fontSize: 13, color: '#c8b88a', lineHeight: 1.5 }}>{report.summary}</div>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  )
}
