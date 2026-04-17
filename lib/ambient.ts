export type AmbientModule = 'landing' | 'field' | 'interview' | 'training' | 'scan'

interface AmbientConfig {
  layers: Array<{ freq: number; gain: number; detune?: number }>
  lfoFreq?: number
  lfoDepth?: number
}

const CONFIGS: Record<AmbientModule, AmbientConfig> = {
  landing: {
    layers: [{ freq: 55, gain: 0.018 }, { freq: 82.5, gain: 0.012 }, { freq: 110, gain: 0.007 }],
    lfoFreq: 0.08, lfoDepth: 4,
  },
  field: {
    layers: [{ freq: 82.5, gain: 0.02 }, { freq: 110, gain: 0.012, detune: -14 }, { freq: 165, gain: 0.007 }],
    lfoFreq: 0.12, lfoDepth: 6,
  },
  interview: {
    layers: [{ freq: 196, gain: 0.012 }, { freq: 294, gain: 0.008 }, { freq: 392, gain: 0.005 }],
    lfoFreq: 0.06, lfoDepth: 3,
  },
  training: {
    layers: [{ freq: 261.6, gain: 0.014 }, { freq: 329.6, gain: 0.01 }, { freq: 392, gain: 0.007 }, { freq: 523.2, gain: 0.004 }],
    lfoFreq: 0.07, lfoDepth: 2,
  },
  scan: {
    layers: [{ freq: 220, gain: 0.014 }, { freq: 440, gain: 0.008, detune: 7 }, { freq: 330, gain: 0.006 }],
    lfoFreq: 0.15, lfoDepth: 8,
  },
}

export interface AmbientHandle {
  setMuted: (m: boolean) => void
  destroy: () => void
}

export function createAmbient(module: AmbientModule): AmbientHandle | null {
  if (typeof window === 'undefined') return null
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return null
    const ctx = new AudioCtx()

    const cfg = CONFIGS[module]
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(0, ctx.currentTime)
    masterGain.gain.linearRampToValueAtTime(1, ctx.currentTime + 3)
    masterGain.connect(ctx.destination)

    const oscs: OscillatorNode[] = []

    cfg.layers.forEach(({ freq, gain, detune = 0 }) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      const filter = ctx.createBiquadFilter()

      osc.type = 'sine'
      osc.frequency.value = freq
      if (detune) osc.detune.value = detune

      filter.type = 'lowpass'
      filter.frequency.value = 1200

      g.gain.value = gain

      osc.connect(filter)
      filter.connect(g)
      g.connect(masterGain)
      osc.start()
      oscs.push(osc)

      // LFO on frequency for subtle movement
      if (cfg.lfoFreq && cfg.lfoDepth) {
        const lfo = ctx.createOscillator()
        const lfoGain = ctx.createGain()
        lfo.frequency.value = cfg.lfoFreq + Math.random() * 0.02
        lfoGain.gain.value = cfg.lfoDepth
        lfo.connect(lfoGain)
        lfoGain.connect(osc.frequency)
        lfo.start()
        oscs.push(lfo)
      }
    })

    return {
      setMuted: (muted: boolean) => {
        const target = muted ? 0 : 1
        masterGain.gain.cancelScheduledValues(ctx.currentTime)
        masterGain.gain.linearRampToValueAtTime(target, ctx.currentTime + 1.5)
      },
      destroy: () => {
        masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1)
        setTimeout(() => {
          oscs.forEach(o => { try { o.stop() } catch {} })
          ctx.close()
        }, 1200)
      },
    }
  } catch {
    return null
  }
}
