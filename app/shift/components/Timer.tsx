'use client'

import { useEffect, useRef } from 'react'

interface TimerProps {
  seconds: number
  total: number
  onExpire: () => void
  running: boolean
}

export default function Timer({ seconds, total, onExpire, running }: TimerProps) {
  const calledRef = useRef(false)

  useEffect(() => {
    if (seconds <= 0 && running && !calledRef.current) {
      calledRef.current = true
      onExpire()
    }
    if (seconds > 0) calledRef.current = false
  }, [seconds, running, onExpire])

  const radius = 36
  const circumference = 2 * Math.PI * radius
  const progress = seconds / total
  const dashOffset = circumference * (1 - progress)
  const color = seconds > 15 ? '#3b9eff' : seconds > 8 ? '#f59e0b' : '#ef4444'

  return (
    <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
      <svg width={90} height={90} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={45} cy={45} r={radius} fill="none" stroke="#1e3a5f" strokeWidth={5} />
        <circle
          cx={45}
          cy={45}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={5}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 1s linear, stroke 0.3s',
            filter: `drop-shadow(0 0 6px ${color})`,
          }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          fontWeight: 700,
          color,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {seconds}
      </div>
    </div>
  )
}
