'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import type { SceneResult, GuestAudioResult, InspectorResult } from '@/lib/shift/types'
import { SCENES, TOTAL_SCENES } from '@/lib/shift/scenes'
import GuestAudioScene from './components/GuestAudioScene'
import InspectorScene from './components/InspectorScene'
import ShiftReport from './components/ShiftReport'
import { createAmbient, type AmbientHandle } from '@/lib/ambient'

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
  const [muted, setMuted] = useState(false)
  const ambientRef = useRef<AmbientHandle | null>(null)

  useEffect(() => {
    ambientRef.current = createAmbient('field')
    return () => { ambientRef.current?.destroy() }
  }, [])

  function toggleMute() {
    const next = !muted; setMuted(next); ambientRef.current?.setMuted(next)
  }

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

      <button onClick={toggleMute} style={{ position:'fixed', top:12, right:12, zIndex:100, background:'rgba(6,13,23,0.9)', border:'1px solid rgba(0,220,130,0.2)', borderRadius:8, padding:'5px 9px', fontSize:14, cursor:'pointer' }}>{muted ? '🔇' : '🔊'}</button>
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
      padding: '28px 24px', gap: 20, textAlign: 'center',
      animation: 'fadeIn 0.4s ease', overflow: 'auto',
    }}>
      {/* Forbes badge + title */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 20, padding: '5px 14px' }}>
          <span style={{ fontSize: 12, color: '#c9a84c' }}>★★★★★</span>
          <span style={{ fontSize: 10, color: '#e8d090', fontWeight: 700, letterSpacing: 2 }}>FORBES 5-STAR</span>
          <span style={{ fontSize: 12, color: '#c9a84c' }}>★★★★★</span>
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#f4f0e8', letterSpacing: 3, margin: 0, textShadow: '0 0 30px rgba(201,168,76,0.25)' }}>
          Career Simulator
        </h1>
        <p style={{ fontSize: 10, color: '#9a8868', fontWeight: 600, letterSpacing: 4, margin: 0, textTransform: 'uppercase' }}>
          Professional Waiter · English · AI
        </p>
        <p style={{ fontSize: 13, color: '#c9a84c', fontStyle: 'italic', margin: 0, opacity: 0.8 }}>
          "Train like Forbes. Speak like a native."
        </p>
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, width: '100%' }}>
        {[
          { icon: '🎙', label: '9 Scenes', sub: 'Speak English' },
          { icon: '🔍', label: '9 Inspector', sub: 'Forbes SOPs' },
          { icon: '📋', label: 'Full Report', sub: 'Rick + PDF' },
        ].map(({ icon, label, sub }) => (
          <div key={label} style={{
            background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.18)',
            borderRadius: 12, padding: '10px 6px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 20 }}>{icon}</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#fff', marginTop: 4 }}>{label}</div>
            <div style={{ fontSize: 9, color: '#556b82', marginTop: 2 }}>{sub}</div>
          </div>
        ))}
      </div>

      {/* Rick card */}
      <div style={{ display:'flex', alignItems:'center', gap:14, background:'linear-gradient(135deg,rgba(10,20,35,0.95),rgba(6,12,24,0.95))', border:'1px solid rgba(245,158,11,0.25)', borderRadius:16, padding:'14px 16px', width:'100%', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(245,158,11,0.4),transparent)' }} />
        <div style={{ position:'relative', flexShrink:0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/scenes/rick.jpeg" alt="Rick" style={{ width:54, height:54, borderRadius:'50%', objectFit:'cover', objectPosition:'50% 25%', display:'block' }}
            onError={e => { const el = e.currentTarget; el.style.display='none'; (el.nextSibling as HTMLElement).style.display='flex' }}
          />
          <div style={{ width:54, height:54, borderRadius:'50%', background:'linear-gradient(135deg,#0a2a4a,#1a5fa8)', display:'none', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:900, color:'#fff' }}>R</div>
          <div style={{ position:'absolute', inset:-2, borderRadius:'50%', border:'2px solid transparent', background:'linear-gradient(#020810,#020810) padding-box, linear-gradient(135deg,#f59e0b,#fcd34d,#b45309) border-box' }} />
          <div style={{ position:'absolute', bottom:1, right:1, width:11, height:11, borderRadius:'50%', background:'#22c55e', border:'2px solid #020810' }} />
        </div>
        <div style={{ textAlign:'left' }}>
          <div style={{ fontSize:13, fontWeight:800, color:'#fff', marginBottom:3 }}>
            Rick — Your Mentor
            <span style={{ marginLeft:7, fontSize:9, color:'#f59e0b', background:'rgba(245,158,11,0.12)', border:'1px solid rgba(245,158,11,0.3)', borderRadius:5, padding:'1px 6px' }}>ONLINE</span>
          </div>
          <p style={{ fontSize:11, color:'#7aa8cc', margin:0, lineHeight:1.5 }}>
            Vai avaliar cada cena, corrigir seu inglês e te dar feedback de voz personalizado no final.
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        style={{
          width: '100%', padding: '16px', borderRadius: 14, border: 'none',
          background: 'linear-gradient(135deg,#c9a84c,#8b6914)',
          color: '#07050b', fontSize: 15, fontWeight: 900, cursor: 'pointer',
          boxShadow: '0 0 30px rgba(201,168,76,0.45)',
          letterSpacing: 3,
        }}
      >
        BEGIN SIMULATION
      </button>

      <p style={{ fontSize: 10, color: '#3b5a7a', margin: 0 }}>
        Microphone required · English responses · AI evaluation
      </p>
    </div>
  )
}
