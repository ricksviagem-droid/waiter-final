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
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, lastFeedback, report])

  useEffect(() => {
    if (sessionEnded || isWaitingForAI) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          void handleTimeout()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
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
    let betterPhrase =
      'Good evening, sir. Welcome to Grand Lux Café. My name is Ned and I will be taking care of you tonight.'

    if (tooCasual) {
      strikeAdded = true
      pointsDelta = -2
      title = 'Too casual'
      message = 'Your tone was too informal for a luxury dining context.'
      betterPhrase = 'Good evening, sir. Welcome to Grand Lux Café. How may I assist you this evening?'
      return { title, message, betterPhrase, strikeAdded, pointsDelta }
    }

    if (tooShort) {
      strikeAdded = true
      pointsDelta = -1
      title = 'Too short'
      message = 'Your response was too limited and did not feel like professional service.'
      betterPhrase =
        'Good evening, sir. Welcome to Grand Lux Café. My name is Ned and I will be taking care of you tonight.'
      return { title, message, betterPhrase, strikeAdded, pointsDelta }
    }

    if (currentMood === 'annoyed' && !hasApology) {
      strikeAdded = true
      pointsDelta = -1
      title = 'Missed recovery'
      message = 'The guest was already upset. You should have acknowledged the issue and recovered the situation.'
      betterPhrase =
        'I sincerely apologize for the delay, sir. Thank you for your patience. How may I assist you now?'
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
      betterPhrase =
        'Good evening, sir. My name is Ned and I will be taking care of you tonight. May I offer you still or sparkling water to begin?'
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

    setStrikes(nextStrikes)
    setScore(nextScore)
    setMood(getMood(nextStrikes, nextScore))

    const feedback: TurnFeedback = {
      title: 'Timeout',
      message: 'You did not answer in time. In real service, silence damages the guest experience.',
      betterPhrase: 'I sincerely apologize for the wait, sir. Thank you for your patience.',
      strikeAdded: true,
      pointsDelta: -2,
    }

    setLastFeedback(feedback)
    setTurnFeedbacks((prev) => [...prev, feedback])

    if (nextStrikes >= MAX_STRIKES) {
      const finalGuestLine =
        "This is unacceptable. Please call the manager. We're leaving."

      setMessages((prev) => [...prev, { role: 'assistant', text: finalGuestLine }])
      setConversation((prev) => [...prev, { role: 'assistant', content: finalGuestLine }])
      setSessionEnded(true)
      setEndReason('🚨 Game Over — 3 service failures. The guest asked for the manager and left.')
      setIsWaitingForAI(false)
      setTimeLeft(0)
      return
    }

    setIsWaitingForAI(true)

    const timeoutConversation: AIMessage[] = [
      ...conversation,
      {
        role: 'user',
        content:
          'The waiter stayed silent too long and failed to respond in time.',
      },
    ]

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: timeoutConversation }),
      })

      const data = await res.json()

      setConversation([
        ...timeoutConversation,
        { role: 'assistant', content: data.response },
      ])

      setMessages((prev) => [...prev, { role: 'assistant', text: data.response }])
    } finally {
      setIsWaitingForAI(false)
      setTimeLeft(TURN_TIME)
    }
  }

  async function handleSend() {
    if (!input.trim() || sessionEnded || isWaitingForAI) return

    const currentInput = input.trim()
    setInput('')
    setIsWaitingForAI(true)

    const feedback = evaluateTurn(currentInput, timeLeft, mood)
    const nextStrikes = feedback.strikeAdded ? strikes + 1 : strikes
    const nextScore = Math.max(score + feedback.pointsDelta, 0)
    const nextGoodTurns = feedback.strikeAdded ? goodTurns : goodTurns + 1
    const nextMood = getMood(nextStrikes, nextScore)

    setLastFeedback(feedback)
    setTurnFeedbacks((prev) => [...prev, feedback])
    setStrikes(nextStrikes)
    setScore(nextScore)
    setGoodTurns(nextGoodTurns)
    setMood(nextMood)

    setMessages((prev) => [...prev, { role: 'user', text: currentInput }])

    const newConversation: AIMessage[] = [
      ...conversation,
      { role: 'user', content: currentInput },
    ]

    if (nextStrikes >= MAX_STRIKES) {
      const finalGuestLine =
        'This is not the standard I expect here. Please call the manager.'

      setMessages((prev) => [...prev, { role: 'assistant', text: finalGuestLine }])
      setConversation([...newConversation, { role: 'assistant', content: finalGuestLine }])
      setSessionEnded(true)
      setEndReason('🚨 Game Over — 3 errors reached. The guest requested the manager.')
      setIsWaitingForAI(false)
      setTimeLeft(0)
      return
    }

    if (nextGoodTurns >= TARGET_GOOD_TURNS) {
      const successGuestLine = 'Thank you. That was much better.'

      setMessages((prev) => [...prev, { role: 'assistant', text: successGuestLine }])
      setConversation([...newConversation, { role: 'assistant', content: successGuestLine }])
      setSessionEnded(true)
      setEndReason('🏆 Success — You completed the first service round.')
      setIsWaitingForAI(false)
      setTimeLeft(0)
      return
    }

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newConversation }),
      })

      const data = await res.json()

      setConversation([
        ...newConversation,
        { role: 'assistant', content: data.response },
      ])

      setMessages((prev) => [...prev, { role: 'assistant', text: data.response }])
    } finally {
      setIsWaitingForAI(false)
      setTimeLeft(TURN_TIME)
    }
  }

  async function handleEvaluate() {
    if (isEvaluating) return

    setIsEvaluating(true)

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversation,
          stats: {
            score,
            strikes,
            goodTurns,
            sessionEnded,
            endReason,
            medal,
          },
          turnFeedbacks,
        }),
      })

      const data = await res.json()
      setReport(data.report)
    } finally {
      setIsEvaluating(false)
    }
  }

  function handleReset() {
    setInput('')
    setMessages([{ role: 'assistant', text: 'Good evening.' }])
    setConversation([{ role: 'assistant', content: 'Good evening.' }])
    setTimeLeft(TURN_TIME)
    setIsWaitingForAI(false)
    setSessionEnded(false)
    setStrikes(0)
    setGoodTurns(0)
    setScore(0)
    setMood('neutral')
    setEndReason('')
    setLastFeedback(null)
    setTurnFeedbacks([])
    setReport(null)
  }

  return (
    <div style={styles.page}>
      <div style={styles.phone}>
        <div style={styles.header}>
          <div>
            <div style={styles.title}>🍽️ Luxury Training</div>
            <div style={styles.subTitle}>Waiter — Phase 1</div>
          </div>

          <div style={styles.headerRight}>
            <span>⏱ {timeLeft}s</span>
            <span>🎭 {mood}</span>
            <span>❌ {strikes}/{MAX_STRIKES}</span>
          </div>
        </div>

        <div style={styles.topStats}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Progress</div>
            <div style={styles.statValue}>{goodTurns}/{TARGET_GOOD_TURNS}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Score</div>
            <div style={styles.statValue}>{score}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Medal</div>
            <div style={styles.statValue}>{medal}</div>
          </div>
        </div>

        {sessionEnded && (
          <div style={styles.banner}>
            <strong>{endReason}</strong>
          </div>
        )}

        {lastFeedback && (
          <div style={styles.feedbackCard}>
            <div style={styles.feedbackTitle}>Round Feedback — {lastFeedback.title}</div>
            <div style={styles.feedbackText}>{lastFeedback.message}</div>
            <div style={styles.feedbackPhrase}>
              Better phrase: {lastFeedback.betterPhrase}
            </div>
          </div>
        )}

        <div ref={chatRef} style={styles.chatArea}>
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user'
            return (
              <div
                key={index}
                style={{
                  ...styles.bubble,
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  background: isUser ? '#005c4b' : '#262626',
                }}
              >
                {msg.text}
              </div>
            )
          })}

          {isWaitingForAI && <div style={styles.waiting}>Guest is responding...</div>}
        </div>

        <div style={styles.actionsBar}>
          <button style={styles.secondaryButton} onClick={handleEvaluate}>
            {isEvaluating ? 'Evaluating...' : 'Evaluate'}
          </button>
          <button style={styles.secondaryButton} onClick={handleReset}>
            Restart
          </button>
        </div>

        <div style={styles.inputBar}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={sessionEnded ? 'Session ended' : 'Type as waiter...'}
            disabled={sessionEnded || isWaitingForAI}
            style={styles.input}
          />
          <button
            onClick={handleSend}
            disabled={sessionEnded || isWaitingForAI}
            style={styles.sendButton}
          >
            ➤
          </button>
        </div>

        {report && (
          <div style={styles.reportCard}>
            <div style={styles.reportTitle}>AI Performance Report</div>
            <div style={styles.reportGrid}>
              <div>Overall: {report.overallScore}/10</div>
              <div>English: {report.english}/10</div>
              <div>Professionalism: {report.professionalism}/10</div>
              <div>Timing: {report.timing}/10</div>
              <div>Guest Impact: {report.guestImpact}/10</div>
              <div>Verdict: {report.verdict}</div>
            </div>

            <div style={styles.reportSection}>
              <strong>Strengths</strong>
              <ul>
                {report.strengths.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={styles.reportSection}>
              <strong>Improvements</strong>
              <ul>
                {report.improvements.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </div>

            <div style={styles.reportSection}>
              <strong>Better phrase</strong>
              <div>{report.betterPhrase}</div>
            </div>

            <div style={styles.reportSection}>
              <strong>Summary</strong>
              <div>{report.summary}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#0b141a',
    color: 'white',
    display: 'flex',
    justifyContent: 'center',
    padding: 12,
    boxSizing: 'border-box',
    fontFamily: 'Inter, Arial, sans-serif',
  },
  phone: {
    width: '100%',
    maxWidth: 520,
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    background: '#111b21',
  },
  header: {
    background: '#202c33',
    padding: '14px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontWeight: 700,
    fontSize: 16,
  },
  subTitle: {
    fontSize: 12,
    opacity: 0.8,
  },
  headerRight: {
    display: 'flex',
    gap: 10,
    fontSize: 12,
    opacity: 0.9,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  topStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
    padding: 12,
  },
  statCard: {
    background: '#1f2c34',
    borderRadius: 12,
    padding: 10,
  },
  statLabel: {
    fontSize: 11,
    opacity: 0.75,
  },
  statValue: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: 700,
  },
  banner: {
    margin: '0 12px 12px',
    padding: 12,
    background: '#4b1d1d',
    borderRadius: 12,
    color: '#ffd8d8',
  },
  feedbackCard: {
    margin: '0 12px 12px',
    padding: 12,
    background: '#14212a',
    borderRadius: 12,
    border: '1px solid #223240',
  },
  feedbackTitle: {
    fontWeight: 700,
    marginBottom: 6,
  },
  feedbackText: {
    fontSize: 14,
    marginBottom: 6,
  },
  feedbackPhrase: {
    fontSize: 13,
    color: '#9fd3ff',
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    overflowY: 'auto',
    padding: '0 12px 12px',
  },
  bubble: {
    padding: '12px 14px',
    borderRadius: 14,
    maxWidth: '80%',
    fontSize: 14,
    lineHeight: 1.4,
    whiteSpace: 'pre-wrap',
  },
  waiting: {
    fontSize: 12,
    opacity: 0.75,
    textAlign: 'center',
    padding: 8,
  },
  actionsBar: {
    display: 'flex',
    gap: 8,
    padding: '0 12px 12px',
  },
  secondaryButton: {
    flex: 1,
    padding: '12px 14px',
    borderRadius: 12,
    border: 'none',
    background: '#2a3942',
    color: 'white',
    fontWeight: 600,
    cursor: 'pointer',
  },
  inputBar: {
    display: 'flex',
    gap: 8,
    padding: 12,
    background: '#202c33',
    position: 'sticky',
    bottom: 0,
  },
  input: {
    flex: 1,
    padding: '12px 14px',
    borderRadius: 24,
    border: 'none',
    outline: 'none',
    background: '#2a3942',
    color: 'white',
    fontSize: 14,
  },
  sendButton: {
    width: 50,
    borderRadius: 999,
    border: 'none',
    background: '#00a884',
    color: 'white',
    fontWeight: 700,
    cursor: 'pointer',
  },
  reportCard: {
    margin: 12,
    padding: 16,
    background: '#182229',
    borderRadius: 14,
    border: '1px solid #2b3d48',
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 12,
  },
  reportGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 8,
    fontSize: 14,
    marginBottom: 14,
  },
  reportSection: {
    marginTop: 10,
    fontSize: 14,
  },
}

