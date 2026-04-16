'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { InspectorScene as InspectorSceneType, InspectorResult } from '@/lib/shift/types'
import Timer from './Timer'
import { TIMER_SECONDS } from '@/lib/shift/scenes'

interface Props {
  scene: InspectorSceneType
  sceneNumber: number
  totalScenes: number
  onComplete: (result: InspectorResult) => void
  onPartialReport: () => void
}

export default function InspectorScene({ scene, sceneNumber, totalScenes, onComplete, onPartialReport }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const autoAdvanceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const buildResult = useCallback((idx: number): InspectorResult => ({
    sceneId: scene.id, type: 'inspector',
    selectedIndex: idx, correctIndex: scene.correctIndex,
    score: idx === scene.correctIndex ? 10 : 0,
    passed: idx === scene.correctIndex,
    explanation: scene.options[scene.correctIndex]?.explanation ?? '',
  }), [scene])

  const handleExpire = useCallback(() => {
    if (!revealed) {
      setRevealed(true)
      clearInterval(timerRef.current!)
      const r = buildResult(-1)
      autoAdvanceRef.current = setTimeout(() => onComplete(r), 3000)
    }
  }, [revealed, buildResult, onComplete])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0 }
        return t - 1
      })
    }, 1000)
    return () => {
      clearInterval(timerRef.current!)
      if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
    }
  }, [])

  const handleSelect = (i: number) => {
    if (revealed) return
    setSelected(i)
    setRevealed(true)
    clearInterval(timerRef.current!)
    const r = buildResult(i)
    // Auto-advance after 3s unless user opens feedback
    autoAdvanceRef.current = setTimeout(() => {
      if (!showFeedback) onComplete(r)
    }, 3000)
  }

  const handleManualAdvance = () => {
    if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current)
    if (selected !== null) onComplete(buildResult(selected))
    else onComplete(buildResult(-1))
  }

  const optionStyle = (i: number) => {
    if (!revealed) return { border: '1px solid #1e3a5f', bg: 'rgba(14,26,42,0.6)', text: '#c8dff5' }
    const isCorrect = i === scene.correctIndex
    const isSelected = selected === i
    if (isCorrect) return { border: '#16a34a', bg: 'rgba(34,197,94,0.1)', text: '#86efac' }
    if (isSelected && !isCorrect) return { border: '#b91c1c', bg: 'rgba(239,68,68,0.1)', text: '#fca5a5' }
    return { border: '#1e3a5f', bg: 'rgba(14,26,42,0.3)', text: '#556b82' }
  }

  const passed = selected === scene.correctIndex

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Scene image 55% */}
      <div style={{ height: '55%', position: 'relative', background: '#0a1520', flexShrink: 0, overflow: 'hidden' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/scenes/scene-${String(scene.id).padStart(2, '0')}.jpg`} alt={scene.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }} />
        <div style={{ position: 'absolute', top: 14, left: 14, background: 'rgba(10,20,35,0.85)', backdropFilter: 'blur(8px)', border: '1px solid #f59e0b', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600, color: '#f59e0b' }}>
          SCENE {sceneNumber} / {totalScenes}
        </div>
        <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(245,158,11,0.12)', border: '1px solid #f59e0b', borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600, color: '#f59e0b', backdropFilter: 'blur(8px)' }}>
          🔍 INSPECTOR
        </div>
        {revealed && (
          <div style={{ position: 'absolute', bottom: 14, left: '50%', transform: 'translateX(-50%)', background: passed ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)', border: `1px solid ${passed ? '#22c55e' : '#ef4444'}`, borderRadius: 20, padding: '5px 16px', fontSize: 13, fontWeight: 700, color: passed ? '#22c55e' : '#ef4444' }}>
            {passed ? '✓ Correct' : '✗ Incorrect'}
          </div>
        )}
      </div>

      {/* Interaction panel 45% */}
      <div style={{ flex: 1, background: 'rgba(10,18,30,0.97)', borderTop: '1px solid #2d2000', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 8, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, paddingRight: 10 }}>
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#fff' }}>{scene.title}</h2>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>{scene.sopReference}</p>
          </div>
          {!revealed && <Timer seconds={timeLeft} total={TIMER_SECONDS} onExpire={handleExpire} running={!revealed} />}
        </div>

        {/* Inspector question */}
        <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid #2d2000', borderRadius: 10, padding: '8px 12px' }}>
          <p style={{ margin: 0, fontSize: 12, color: '#fcd34d', lineHeight: 1.5, fontStyle: 'italic' }}>"{scene.inspectorMessage}"</p>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, overflow: 'auto' }}>
          {scene.options.map((opt, i) => {
            const s = optionStyle(i)
            return (
              <button key={i} onClick={() => handleSelect(i)} disabled={revealed}
                style={{ textAlign: 'left', padding: '9px 12px', border: `1px solid ${s.border}`, borderRadius: 10, background: s.bg, color: s.text, fontSize: 12, lineHeight: 1.4, cursor: revealed ? 'default' : 'pointer', transition: 'all 0.2s', width: '100%' }}>
                <span style={{ fontWeight: 700, marginRight: 6, fontSize: 11, opacity: 0.7 }}>{String.fromCharCode(65 + i)}.</span>
                {opt.label}
              </button>
            )
          })}
        </div>

        {/* Feedback on demand */}
        {revealed && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { if (autoAdvanceRef.current) clearTimeout(autoAdvanceRef.current); setShowFeedback(v => !v) }}
              style={{ flex: 1, padding: '8px', borderRadius: 10, border: '1px solid #1e3a5f', background: showFeedback ? 'rgba(59,158,255,0.15)' : 'transparent', color: '#3b9eff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
              📋 Why?
            </button>
            {showFeedback && (
              <button onClick={handleManualAdvance}
                style={{ flex: 1, padding: '8px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#f59e0b,#b45309)', color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>
                Next →
              </button>
            )}
          </div>
        )}

        {revealed && showFeedback && (
          <div style={{ background: 'rgba(59,158,255,0.06)', border: '1px solid #1e3a5f', borderRadius: 10, padding: '8px 12px' }}>
            <p style={{ margin: 0, fontSize: 12, color: '#c8dff5', lineHeight: 1.5 }}>
              {scene.options[scene.correctIndex].explanation}
            </p>
          </div>
        )}

        {revealed && !showFeedback && (
          <p style={{ margin: 0, fontSize: 11, color: '#3b5a7a', textAlign: 'center' }}>Advancing to next scene…</p>
        )}

        <button onClick={onPartialReport} style={{ background: 'none', border: 'none', color: '#2a4a6a', fontSize: 11, cursor: 'pointer', textDecoration: 'underline', padding: 0, alignSelf: 'center' }}>
          View partial report
        </button>
      </div>
    </div>
  )
}
