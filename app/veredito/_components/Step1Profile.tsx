'use client'

import { useState } from 'react'
import type { ProfileData } from '@/lib/veredito/types'

interface Props {
  onSubmit: (data: ProfileData) => void
}

const EXPERIENCE_OPTIONS = [
  { value: 'none' as const, label: 'Nenhuma', description: 'Nunca trabalhei no setor' },
  { value: 'some' as const, label: 'Alguma', description: '1-2 anos no setor' },
  { value: 'experienced' as const, label: 'Experiente', description: '3-5 anos no setor' },
  { value: 'expert' as const, label: 'Expert', description: '5+ anos no setor' },
]

export default function Step1Profile({ onSubmit }: Props) {
  const [experience, setExperience] = useState<ProfileData['experience'] | null>(null)
  const [hoursPerDay, setHoursPerDay] = useState('')
  const [hasSkilledPartner, setHasSkilledPartner] = useState<boolean | null>(null)
  const [totalCapital, setTotalCapital] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const parseCapital = (val: string) => Number(val.replace(/\D/g, ''))
  const formatCapital = (val: string) => {
    const num = val.replace(/\D/g, '')
    return num ? Number(num).toLocaleString('pt-BR') : ''
  }

  const handleSubmit = () => {
    const errs: Record<string, string> = {}
    if (!experience) errs.experience = 'Selecione sua experiência'
    const hours = Number(hoursPerDay)
    if (!hoursPerDay || isNaN(hours) || hours < 1 || hours > 24)
      errs.hoursPerDay = 'Informe entre 1 e 24 horas'
    if (hasSkilledPartner === null) errs.partner = 'Responda esta pergunta'
    const capital = parseCapital(totalCapital)
    if (!capital || capital < 1000) errs.totalCapital = 'Capital mínimo de R$ 1.000'
    setErrors(errs)
    if (Object.keys(errs).length) return
    onSubmit({ experience: experience!, hoursPerDay: hours, hasSkilledPartner: hasSkilledPartner!, totalCapital: capital })
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-2">Etapa 1 de 2</p>
        <h1 className="text-2xl font-bold mb-1">Sobre você</h1>
        <p className="text-zinc-400 text-sm">Precisamos entender quem está por trás da ideia.</p>
      </div>

      {/* Experience */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-zinc-200">Experiência no setor alimentício</label>
        <div className="grid grid-cols-2 gap-2">
          {EXPERIENCE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setExperience(opt.value)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                experience === opt.value
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
              }`}
            >
              <div className="font-semibold text-sm text-zinc-100">{opt.label}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{opt.description}</div>
            </button>
          ))}
        </div>
        {errors.experience && <p className="text-red-400 text-xs">{errors.experience}</p>}
      </div>

      {/* Hours */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-200">
          Horas disponíveis por dia para o negócio
        </label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            min="1"
            max="24"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(e.target.value)}
            placeholder="8"
            className="w-20 px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-center text-xl font-bold focus:outline-none focus:border-amber-500 transition-colors"
          />
          <span className="text-zinc-400 text-sm">horas por dia</span>
        </div>
        {errors.hoursPerDay && <p className="text-red-400 text-xs">{errors.hoursPerDay}</p>}
      </div>

      {/* Partner */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-200">
          Tem sócio com experiência real no setor?
        </label>
        <div className="flex gap-3">
          {[{ value: true, label: 'Sim' }, { value: false, label: 'Não' }].map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => setHasSkilledPartner(opt.value)}
              className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${
                hasSkilledPartner === opt.value
                  ? 'border-amber-500 bg-amber-500/10 text-amber-50'
                  : 'border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        {errors.partner && <p className="text-red-400 text-xs">{errors.partner}</p>}
      </div>

      {/* Capital */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-200">Capital total disponível</label>
        <p className="text-xs text-zinc-500">
          Inclua o valor de abertura + reserva mínima de 6 meses de custo fixo
        </p>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus-within:border-amber-500 transition-colors">
          <span className="text-zinc-500 font-medium">R$</span>
          <input
            type="text"
            inputMode="numeric"
            value={totalCapital}
            onChange={(e) => setTotalCapital(formatCapital(e.target.value))}
            placeholder="100.000"
            className="flex-1 bg-transparent text-lg font-bold focus:outline-none placeholder:text-zinc-700"
          />
        </div>
        {errors.totalCapital && <p className="text-red-400 text-xs">{errors.totalCapital}</p>}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        className="w-full py-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 font-bold rounded-xl text-base transition-colors"
      >
        Continuar →
      </button>
    </div>
  )
}
