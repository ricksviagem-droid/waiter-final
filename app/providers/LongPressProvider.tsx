'use client'

import { useEffect, useRef, useState, createContext, useContext } from 'react'

interface Tooltip { x: number; y: number; original: string; pt: string | null; loading: boolean }

const Ctx = createContext<null>(null)

export function LongPressProvider({ children }: { children: React.ReactNode }) {
  const [tooltip, setTooltip] = useState<Tooltip | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const activeTextRef = useRef<string>('')

  useEffect(() => {
    function getTextAt(el: Element | null): string {
      while (el && el !== document.body) {
        const text = (el as HTMLElement).innerText?.trim()
        if (text && text.length > 2 && text.length < 300) return text
        el = el.parentElement
      }
      return ''
    }

    function onStart(e: TouchEvent) {
      const el = e.target as Element
      const text = getTextAt(el)
      if (!text) return
      activeTextRef.current = text
      const touch = e.touches[0]
      timerRef.current = setTimeout(async () => {
        const x = Math.min(touch.clientX, window.innerWidth - 200)
        const y = Math.max(touch.clientY - 100, 60)
        setTooltip({ x, y, original: text, pt: null, loading: true })
        try {
          const res = await fetch('/api/shift/translate', {
            method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text.slice(0, 200), mode: 'sentence' }),
          })
          const data = await res.json()
          setTooltip(prev => prev ? { ...prev, pt: data.pt ?? null, loading: false } : null)
        } catch {
          setTooltip(prev => prev ? { ...prev, pt: '—', loading: false } : null)
        }
      }, 600)
    }

    function onEnd() {
      if (timerRef.current) clearTimeout(timerRef.current)
    }

    function onMove() {
      if (timerRef.current) clearTimeout(timerRef.current)
    }

    document.addEventListener('touchstart', onStart, { passive: true })
    document.addEventListener('touchend', onEnd)
    document.addEventListener('touchmove', onMove, { passive: true })
    return () => {
      document.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchend', onEnd)
      document.removeEventListener('touchmove', onMove)
    }
  }, [])

  return (
    <Ctx.Provider value={null}>
      {children}
      {tooltip && (
        <div
          onClick={() => setTooltip(null)}
          style={{
            position: 'fixed', left: tooltip.x, top: tooltip.y, zIndex: 9999,
            width: 220, background: 'rgba(9,9,11,0.97)',
            border: '1px solid rgba(0,220,130,0.35)', borderRadius: 14,
            padding: '12px 14px', boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
            backdropFilter: 'blur(12px)', pointerEvents: 'auto',
          }}
        >
          <div style={{ fontSize: 10, color: 'rgba(0,220,130,0.6)', marginBottom: 5, fontWeight: 700, letterSpacing: 1 }}>PORTUGUESE</div>
          {tooltip.loading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, border: '2px solid #00dc82', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
              <span style={{ fontSize: 12, color: '#4a6a55' }}>Translating…</span>
            </div>
          ) : (
            <p style={{ fontSize: 13, color: '#e8edf2', lineHeight: 1.6, margin: 0 }}>{tooltip.pt}</p>
          )}
          <p style={{ fontSize: 10, color: '#2a3a2a', marginTop: 6, margin: '6px 0 0' }}>Tap to close</p>
        </div>
      )}
    </Ctx.Provider>
  )
}
