'use client'
import { useState } from 'react'

interface Props {
  size: number
  imgStyle?: React.CSSProperties
  fallbackStyle?: React.CSSProperties
}

export default function RickPhoto({ size, imgStyle, fallbackStyle }: Props) {
  const [failed, setFailed] = useState(false)
  const base: React.CSSProperties = { width: size, height: size, borderRadius: '50%', flexShrink: 0 }
  if (failed) {
    return (
      <div style={{ ...base, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.round(size * 0.38), fontWeight: 900, color: '#7ab0cc', background: 'rgba(122,176,204,0.1)', ...fallbackStyle }}>
        R
      </div>
    )
  }
  return (
    <img
      src="/scenes/rick.jpeg"
      alt="Rick"
      onError={() => setFailed(true)}
      style={{ ...base, objectFit: 'cover', objectPosition: '50% 25%', display: 'block', ...imgStyle }}
    />
  )
}
