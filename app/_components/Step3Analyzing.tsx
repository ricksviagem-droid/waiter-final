'use client'

import { useEffect, useState } from 'react'

const STEPS = [
  { text: 'Buscando taxa de mortalidade do setor...', source: 'SEBRAE / IBGE' },
  { text: 'Analisando custo de abertura na sua cidade...', source: 'Prefeituras e fornecedores' },
  { text: 'Verificando margem média do setor...', source: 'ABRASEL' },
  { text: 'Calculando impacto das comissões de delivery...', source: 'iFood / Rappi' },
  { text: 'Pesquisando tempo de licenças na sua cidade...', source: 'ANVISA / Prefeitura' },
  { text: 'Analisando saturação e concorrência no bairro...', source: 'Dados de mercado' },
  { text: 'Calculando ponto de equilíbrio realista...', source: 'Modelo financeiro' },
  { text: 'Construindo os três cenários...', source: 'Análise de risco' },
  { text: 'Identificando os principais riscos específicos...', source: 'Dados do setor' },
  { text: 'Formulando recomendação final...', source: 'Análise integrada' },
]

export default function Step3Analyzing() {
  const [visible, setVisible] = useState(1)

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible((v) => Math.min(v + 1, STEPS.length))
    }, 2800)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex flex-col items-center py-10 space-y-10">
      {/* Spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-2 border-zinc-800" />
        <div className="absolute inset-0 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        </div>
      </div>

      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold">Analisando sua ideia</h2>
        <p className="text-zinc-400 text-sm max-w-xs mx-auto">
          A IA está buscando dados reais para dar uma resposta honesta sobre a viabilidade do seu negócio.
        </p>
      </div>

      {/* Steps list */}
      <div className="w-full space-y-3">
        {STEPS.slice(0, visible).map((step, i) => {
          const isDone = i < visible - 1
          const isActive = i === visible - 1
          return (
            <div
              key={i}
              className={`flex items-start gap-3 text-sm transition-all duration-500 ${
                isDone ? 'opacity-40' : 'opacity-100'
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isDone ? (
                  <div className="w-4 h-4 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  </div>
                ) : (
                  <div className="w-4 h-4 rounded-full border border-amber-500 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  </div>
                )}
              </div>
              <div>
                <p className={isDone ? 'text-zinc-500' : 'text-zinc-200'}>{step.text}</p>
                {isActive && (
                  <p className="text-xs text-zinc-600 mt-0.5">Fonte: {step.source}</p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-zinc-600 text-xs text-center">
        Isso pode levar até 60 segundos. Não feche essa página.
      </p>
    </div>
  )
}
