'use client'

import { useState } from 'react'
import type { IdeaData } from '@/lib/veredito/types'

interface Props {
  onSubmit: (data: IdeaData) => void
  onBack: () => void
}

const MODEL_OPTIONS = [
  { value: 'physical' as const, label: 'Físico', icon: '🏠', description: 'Restaurante / Bar' },
  { value: 'delivery' as const, label: 'Delivery', icon: '🛵', description: 'Só entrega' },
  { value: 'dark_kitchen' as const, label: 'Dark Kitchen', icon: '⬛', description: 'Cozinha para apps' },
  { value: 'hybrid' as const, label: 'Híbrido', icon: '⚡', description: 'Físico + delivery' },
]

export default function Step2Idea({ onSubmit, onBack }: Props) {
  const [foodType, setFoodType] = useState('')
  const [model, setModel] = useState<IdeaData['model'] | null>(null)
  const [city, setCity] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [averageTicket, setAverageTicket] = useState('')
  const [seats, setSeats] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const needsSeats = model === 'physical' || model === 'hybrid'

  const handleSubmit = () => {
    const errs: Record<string, string> = {}
    if (!foodType.trim()) errs.foodType = 'Informe o tipo de comida'
    if (!model) errs.model = 'Selecione o modelo de negócio'
    if (!city.trim()) errs.city = 'Informe a cidade'
    if (!neighborhood.trim()) errs.neighborhood = 'Informe o bairro'
    const ticket = Number(averageTicket)
    if (!ticket || ticket < 1) errs.averageTicket = 'Informe o ticket médio'
    if (needsSeats && (!seats || Number(seats) < 1)) errs.seats = 'Informe o número de lugares'
    setErrors(errs)
    if (Object.keys(errs).length) return
    onSubmit({
      foodType: foodType.trim(),
      model: model!,
      city: city.trim(),
      neighborhood: neighborhood.trim(),
      averageTicket: ticket,
      seats: needsSeats ? Number(seats) : undefined,
    })
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-2">Etapa 2 de 2</p>
        <h1 className="text-2xl font-bold mb-1">A ideia</h1>
        <p className="text-zinc-400 text-sm">Agora vamos entender o que você quer construir.</p>
      </div>

      {/* Food type */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-200">Tipo de comida / cozinha</label>
        <input
          type="text"
          value={foodType}
          onChange={(e) => setFoodType(e.target.value)}
          placeholder="ex: Hambúrguer artesanal, pizza, japonesa, frutos do mar..."
          className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-600"
        />
        {errors.foodType && <p className="text-red-400 text-xs">{errors.foodType}</p>}
      </div>

      {/* Model */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-zinc-200">Modelo de negócio</label>
        <div className="grid grid-cols-2 gap-2">
          {MODEL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setModel(opt.value)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                model === opt.value
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-zinc-800 bg-zinc-900 hover:border-zinc-600'
              }`}
            >
              <div className="text-xl mb-1">{opt.icon}</div>
              <div className="font-semibold text-sm text-zinc-100">{opt.label}</div>
              <div className="text-xs text-zinc-500">{opt.description}</div>
            </button>
          ))}
        </div>
        {errors.model && <p className="text-red-400 text-xs">{errors.model}</p>}
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-200">Cidade</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="São Paulo"
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-600"
          />
          {errors.city && <p className="text-red-400 text-xs">{errors.city}</p>}
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-200">Bairro</label>
          <input
            type="text"
            value={neighborhood}
            onChange={(e) => setNeighborhood(e.target.value)}
            placeholder="Pinheiros"
            className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-sm focus:outline-none focus:border-amber-500 transition-colors placeholder:text-zinc-600"
          />
          {errors.neighborhood && <p className="text-red-400 text-xs">{errors.neighborhood}</p>}
        </div>
      </div>

      {/* Ticket */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-zinc-200">Ticket médio esperado por pessoa</label>
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 focus-within:border-amber-500 transition-colors">
          <span className="text-zinc-500 font-medium">R$</span>
          <input
            type="number"
            min="1"
            value={averageTicket}
            onChange={(e) => setAverageTicket(e.target.value)}
            placeholder="45"
            className="flex-1 bg-transparent text-lg font-bold focus:outline-none placeholder:text-zinc-700"
          />
        </div>
        {errors.averageTicket && <p className="text-red-400 text-xs">{errors.averageTicket}</p>}
      </div>

      {/* Seats (conditional) */}
      {needsSeats && (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-zinc-200">Capacidade do espaço</label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              min="1"
              value={seats}
              onChange={(e) => setSeats(e.target.value)}
              placeholder="40"
              className="w-24 px-3 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-center text-xl font-bold focus:outline-none focus:border-amber-500 transition-colors"
            />
            <span className="text-zinc-400 text-sm">lugares</span>
          </div>
          {errors.seats && <p className="text-red-400 text-xs">{errors.seats}</p>}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="px-6 py-4 border border-zinc-800 text-zinc-400 font-semibold rounded-xl hover:border-zinc-600 hover:text-zinc-200 transition-colors"
        >
          ← Voltar
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 py-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 font-bold rounded-xl text-base transition-colors"
        >
          Analisar viabilidade →
        </button>
      </div>
    </div>
  )
}
