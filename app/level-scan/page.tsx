'use client'

import { useState } from 'react'
import type { ScanResult } from '@/lib/level-scan/data'
import LevelScanScene from './components/LevelScanScene'
import LevelScanReport from './components/LevelScanReport'

type AppState = 'scan' | 'report'

export default function LevelScanPage() {
  const [state, setState] = useState<AppState>('scan')
  const [result, setResult] = useState<ScanResult | null>(null)

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0}to{opacity:1} }
        @keyframes pulse { 0%,100%{opacity:0.5}50%{opacity:1} }
        @keyframes levelReveal { 0%{transform:scale(0.5);opacity:0} 60%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes scanLine { 0%{transform:translateY(-100%)} 100%{transform:translateY(1000%)} }
        @keyframes correctFlash { 0%,100%{background:rgba(0,220,130,0)} 50%{background:rgba(0,220,130,0.15)} }
        @keyframes wrongFlash { 0%,100%{background:rgba(248,113,113,0)} 50%{background:rgba(248,113,113,0.15)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        html,body { height:100%; }
        ::-webkit-scrollbar { width:3px; }
        ::-webkit-scrollbar-thumb { background:#1a1a2a; border-radius:3px; }
      `}</style>

      <div style={{
        minHeight: '100dvh',
        background: 'linear-gradient(160deg,#09090b 0%,#0d0b14 50%,#09090b 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'var(--font-geist-sans,Arial,sans-serif)', padding: 0,
      }}>
        <div style={{
          width: '100%', maxWidth: 430, height: '100dvh', maxHeight: 900,
          background: '#0f0f14', borderRadius: 0, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          border: '1px solid rgba(129,140,248,0.2)',
          boxShadow: '0 0 60px rgba(129,140,248,0.07)',
        }}>
          {state === 'scan' && (
            <LevelScanScene onComplete={(r) => { setResult(r); setState('report') }} />
          )}
          {state === 'report' && result && (
            <LevelScanReport result={result} onRestart={() => setState('scan')} />
          )}
        </div>
      </div>
    </>
  )
}
