'use client'

interface MicButtonProps {
  recording: boolean
  disabled: boolean
  onStart: () => void
  onStop: () => void
}

export default function MicButton({ recording, disabled, onStart, onStop }: MicButtonProps) {
  return (
    <button
      onClick={recording ? onStop : onStart}
      disabled={disabled}
      style={{
        width: 72,
        height: 72,
        borderRadius: '50%',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        background: recording
          ? 'radial-gradient(circle,#ef4444,#b91c1c)'
          : 'radial-gradient(circle,#3b9eff,#1a5fa8)',
        boxShadow: recording
          ? '0 0 0 0 rgba(239,68,68,0.4)'
          : '0 0 20px rgba(59,158,255,0.5)',
        animation: recording ? 'micPulse 1.2s ease-in-out infinite' : 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.3s, box-shadow 0.3s',
        opacity: disabled ? 0.4 : 1,
        flexShrink: 0,
      }}
      aria-label={recording ? 'Stop recording' : 'Start recording'}
    >
      {recording ? (
        <svg width={28} height={28} viewBox="0 0 24 24" fill="#fff">
          <rect x={6} y={6} width={12} height={12} rx={2} />
        </svg>
      ) : (
        <svg width={28} height={28} viewBox="0 0 24 24" fill="#fff">
          <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm0 2a2 2 0 0 0-2 2v7a2 2 0 0 0 4 0V5a2 2 0 0 0-2-2zm-7 9a7 7 0 0 0 14 0h2a9 9 0 0 1-8 8.94V23h-2v-2.06A9 9 0 0 1 3 12h2z" />
        </svg>
      )}
    </button>
  )
}
