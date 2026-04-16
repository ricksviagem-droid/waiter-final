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

const QUALITY_COLORS = {
  excellent: { bg: 'rgba(34,197,94,0.12)', border: '#16a34a', text: '#22c55e' },
  tricky: { bg: 'rgba(245,158,11,0.12)', border: '#b45309', text: '#f59e0b' },
  wrong: { bg: 'rgba(239,68,68,0.12)', border: '#b91c1c', text: '#ef4444' },
}

export default function InspectorScene({ scene, sceneNumber, totalScenes, onComplete, onPartialReport }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const handleExpire = useCallback(() => {
    if (!revealed && selected === null) {
      setSelected(-1)
      setRevealed(true)
    }
  }, [revealed, selected])

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); return 0 }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current!)
  }, [])

  const handleSelect = (i: number) => {
    if (revealed) return
    setSelected(i)
    setRevealed(true)
    clearInterval(timerRef.current!)
  }

  const buildResult = (): InspectorResult => {
    const idx = selected ?? -1
    const passed = idx === scene.correctIndex
    return {
      sceneId: scene.id,
      type: 'inspector',
      selectedIndex: idx,
      correctIndex: scene.correctIndex,
      score: idx === scene.correctIndex ? 10 : idx === -1 ? 0 : 0,
      passed,
      explanation: scene.options[scene.correctIndex]?.explanation ?? '',
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Scene image — 55% */}
      <div style={{ height: '55%', position: 'relative', background: '#0a1520', flexShrink: 0 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/scenes/scene-${String(scene.id).padStart(2, '0')}.jpg`}
          alt={scene.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
        />
        <div style={{
          position: 'absolute', top: 14, left: 14,
          background: 'rgba(10,20,35,0.8)', backdropFilter: 'blur(8px)',
          border: '1px solid #f59e0b', borderRadius: 20,
          padding: '4px 12px', fontSize: 12, fontWeight: 600, color: '#f59e0b',
        }}>
          SCENE {sceneNumber} / {totalScenes}
        </div>
        <div style={{
          position: 'absolute', top: 14, right: 14,
          background: 'rgba(245,158,11,0.12)', border: '1px solid #f59e0b',
          borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600, color: '#f59e0b',
          backdropFilter: 'blur(8px)',
        }}>
          🔍 INSPECTOR
        </div>
      </div>

      {/* Interaction panel — 45% */}
      <div style={{
        flex: 1, background: 'rgba(10,18,30,0.97)',
        borderTop: '1px solid #2d2000', padding: '14px 20px',
        display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ flex: 1, paddingRight: 12 }}>
            <h2 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#fff' }}>{scene.title}</h2>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#f59e0b', fontWeight: 600 }}>{scene.sopReference}</p>
          </div>
          {!revealed && <Timer seconds={timeLeft} total={TIMER_SECONDS} onExpire={handleExpire} running={!revealed} />}
        </div>

        {/* Inspector question */}
        <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid #2d2000', borderRadius: 10, padding: '10px 14px' }}>
          <p style={{ margin: 0, fontSize: 13, color: '#fcd34d', lineHeight: 1.5, fontStyle: 'italic' }}>
            "{scene.inspectorMessage}"
          </p>
        </div>

        {/* Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, overflow: 'auto', flex: 1 }}>
          {scene.options.map((opt, i) => {
            const isSelected = selected === i
            const isCorrect = i === scene.correctIndex
            const colors = QUALITY_COLORS[opt.quality]

            let borderColor = '#1e3a5f'
            let bg = 'rgba(14,26,42,0.6)'
            let textColor = '#c8dff5'

            if (revealed) {
              if (isCorrect) { borderColor = '#16a34a'; bg = 'rgba(34,197,94,0.1)'; textColor = '#86efac' }
              else if (isSelected && !isCorrect) { borderColor = '#b91c1c'; bg = 'rgba(239,68,68,0.1)'; textColor = '#fca5a5' }
            } else if (isSelected) {
              borderColor = colors.border; bg = colors.bg; textColor = colors.text
            }

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={revealed}
                style={{
                  textAlign: 'left', padding: '10px 14px',
                  border: `1px solid ${borderColor}`, borderRadius: 10,
                  background: bg, color: textColor, fontSize: 13, lineHeight: 1.4,
                  cursor: revealed ? 'default' : 'pointer',
                  transition: 'all 0.2s', width: '100%',
                }}
              >
                <span style={{ fontWeight: 700, marginRight: 8, fontSize: 12, opacity: 0.7 }}>
                  {String.fromCharCode(65 + i)}.
                </span>
                {opt.label}
                {revealed && isCorrect && (
                  <div style={{ marginTop: 6, fontSize: 11, color: '#86efac', opacity: 0.9 }}>{opt.explanation}</div>
                )}
                {revealed && isSelected && !isCorrect && (
                  <div style={{ marginTop: 6, fontSize: 11, color: '#fca5a5', opacity: 0.9 }}>{opt.explanation}</div>
                )}
              </button>
            )
          })}
        </div>

        {/* Timeout message */}
        {revealed && selected === -1 && (
          <p style={{ margin: 0, fontSize: 12, color: '#ef4444', textAlign: 'center' }}>
            Time expired — no answer selected.
          </p>
        )}

        {/* Next button */}
        {revealed && (
          <button
            onClick={() => onComplete(buildResult())}
            style={{
              padding: '12px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg,#f59e0b,#b45309)',
              color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}
          >
            Next Scene →
          </button>
        )}

        <button
          onClick={onPartialReport}
          style={{
            background: 'none', border: 'none', color: '#3b5a7a',
            fontSize: 11, cursor: 'pointer', textDecoration: 'underline', padding: 0, alignSelf: 'center',
          }}
        >
          View partial report
        </button>
      </div>
    </div>
  )
}
