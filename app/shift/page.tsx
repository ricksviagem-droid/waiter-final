'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { SceneResult, GuestAudioResult, InspectorResult } from '@/lib/shift/types'
import { SCENES, TOTAL_SCENES } from '@/lib/shift/scenes'
import GuestAudioScene from './components/GuestAudioScene'
import InspectorScene from './components/InspectorScene'
import ShiftReport from './components/ShiftReport'

type AppState = 'intro' | 'scene' | 'report'

function calcScore(results: SceneResult[]): { total: number; max: number } {
  let total = 0
  const max = results.length * 10
  for (const r of results) {
    total += r.score
  }
  return { total, max }
}

export default function ShiftPage() {
  const [state, setState] = useState<AppState>('intro')
  const [sceneIndex, setSceneIndex] = useState(0)
  const [results, setResults] = useState<SceneResult[]>([])
  const ambientRef = useRef<{ ctx: AudioContext; gain: GainNode } | null>(null)

  useEffect(() => {
    return () => { ambientRef.current?.ctx.close() }
  }, [])

  useEffect(() => {
    if (state === 'scene') {
      if (!ambientRef.current) {
        try {
          const ctx = new AudioContext()
          const bufferSize = ctx.sampleRate * 3
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
          const data = buffer.getChannelData(0)
          let b0 = 0, b1 = 0, b2 = 0
          for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1
            b0 = 0.99886 * b0 + white * 0.0555179
            b1 = 0.99332 * b1 + white * 0.0750759
            b2 = 0.96900 * b2 + white * 0.1538520
            data[i] = (b0 + b1 + b2 + white * 0.0782232) * 0.11
          }
          const src = ctx.createBufferSource()
          src.buffer = buffer
          src.loop = true
          const gain = ctx.createGain()
          gain.gain.value = 0.06
          const filter = ctx.createBiquadFilter()
          filter.type = 'lowpass'
          filter.frequency.value = 800
          src.connect(filter)
          filter.connect(gain)
          gain.connect(ctx.destination)
          src.start()
          ambientRef.current = { ctx, gain }
        } catch {}
      } else {
        ambientRef.current.ctx.resume().catch(() => {})
      }
    } else {
      ambientRef.current?.ctx.suspend().catch(() => {})
    }
  }, [state])

  const currentScene = SCENES[sceneIndex]

  const handleSceneComplete = useCallback((result: SceneResult) => {
    const updated = [...results, result]
    setResults(updated)
    if (sceneIndex + 1 >= TOTAL_SCENES) {
      setState('report')
    } else {
      setSceneIndex((i) => i + 1)
    }
  }, [results, sceneIndex])

  const handlePartialReport = useCallback(() => {
    setState('report')
  }, [])

  const handleRestart = useCallback(() => {
    setResults([])
    setSceneIndex(0)
    setState('intro')
  }, [])

  const { total, max } = calcScore(results)

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes micPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5); }
          50% { box-shadow: 0 0 0 14px rgba(239,68,68,0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html, body { height: 100%; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 4px; }
      `}</style>

      <div style={{
        minHeight: '100dvh',
        background: 'linear-gradient(160deg, #060d17 0%, #0a1520 50%, #06111e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-geist-sans, Arial, sans-serif)',
        padding: '0',
      }}>
        {/* Phone container */}
        <div style={{
          width: '100%',
          maxWidth: 430,
          height: '100dvh',
          maxHeight: 900,
          background: '#0a1118',
          borderRadius: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          border: '1px solid #1e3a5f',
          boxShadow: '0 0 60px rgba(59,158,255,0.08)',
        }}>
          {state === 'intro' && (
            <IntroScreen onStart={() => { setSceneIndex(0); setResults([]); setState('scene') }} />
          )}

          {state === 'scene' && currentScene && (
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.3s ease' }}>
              {currentScene.type === 'guest-audio' ? (
                <GuestAudioScene
                  key={`scene-${currentScene.id}`}
                  scene={currentScene}
                  sceneNumber={sceneIndex + 1}
                  totalScenes={TOTAL_SCENES}
                  onComplete={handleSceneComplete as (r: GuestAudioResult) => void}
                  onPartialReport={handlePartialReport}
                />
              ) : (
                <InspectorScene
                  key={`scene-${currentScene.id}`}
                  scene={currentScene}
                  sceneNumber={sceneIndex + 1}
                  totalScenes={TOTAL_SCENES}
                  onComplete={handleSceneComplete as (r: InspectorResult) => void}
                  onPartialReport={handlePartialReport}
                />
              )}
            </div>
          )}

          {state === 'report' && (
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <ShiftReport
                results={results}
                totalScore={total}
                maxScore={Math.max(max, 10)}
                onRestart={handleRestart}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 28px', gap: 28, textAlign: 'center',
      animation: 'fadeIn 0.4s ease',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          background: 'linear-gradient(135deg, #0a2a4a, #1a5fa8)',
          border: '1px solid #3b9eff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 30px rgba(59,158,255,0.3)',
          fontSize: 36,
        }}>
          🍽
        </div>
        <div>
          <h1 style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: 4, margin: 0 }}>SHIFT</h1>
          <p style={{ fontSize: 12, color: '#3b9eff', fontWeight: 600, letterSpacing: 3, margin: 0 }}>
            CAREER ANALYTIC MODULE
          </p>
        </div>
      </div>

      {/* Description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320 }}>
        <p style={{ fontSize: 15, color: '#c8dff5', lineHeight: 1.7, margin: 0 }}>
          A complete simulation of a real Forbes 5-star restaurant shift. You are the waiter. No script. No second chances.
        </p>
        <p style={{ fontSize: 13, color: '#556b82', lineHeight: 1.6, margin: 0 }}>
          18 scenes · 45 seconds each · AI evaluation · Full report
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, width: '100%' }}>
        {[
          { icon: '🎙', label: '9 Guest Audio', sub: 'Speak your response' },
          { icon: '🔍', label: '9 Inspector', sub: 'Choose wisely' },
          { icon: '📋', label: 'Full Report', sub: 'Forbes + Rick audio' },
        ].map(({ icon, label, sub }) => (
          <div key={label} style={{
            background: 'rgba(59,158,255,0.06)', border: '1px solid #1e3a5f',
            borderRadius: 12, padding: '12px 8px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 22 }}>{icon}</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', marginTop: 4 }}>{label}</div>
            <div style={{ fontSize: 10, color: '#556b82', marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        style={{
          width: '100%', padding: '16px', borderRadius: 14, border: 'none',
          background: 'linear-gradient(135deg, #3b9eff, #1a5fa8)',
          color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer',
          boxShadow: '0 0 24px rgba(59,158,255,0.4)',
          letterSpacing: 1,
        }}
      >
        BEGIN SHIFT
      </button>

      <p style={{ fontSize: 11, color: '#3b5a7a', margin: 0 }}>
        Requires microphone access · OpenAI Whisper transcription
      </p>
    </div>
  )
}
