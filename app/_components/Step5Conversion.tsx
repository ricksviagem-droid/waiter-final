'use client'

import type { AnalysisResult } from '@/lib/types'

interface Props {
  analysis: AnalysisResult
  onRestart: () => void
}

const ALTERNATIVES = [
  {
    icon: '⬛',
    title: 'Dark Kitchen em parceria',
    description:
      'Opere de uma cozinha já instalada, dividindo custos fixos. Capital inicial 60-80% menor, sem IPTU nem reforma.',
  },
  {
    icon: '🚚',
    title: 'Food truck ou pop-up',
    description:
      'Mobilidade e custo operacional menor. Valide o conceito e construa base de clientes antes de assinar contrato de ponto fixo.',
  },
  {
    icon: '🤝',
    title: 'Franquia com suporte operacional',
    description:
      'Reduz risco de inexperiência com modelo provado. Margens menores, mas taxa de sobrevivência significativamente maior.',
  },
]

export default function Step5Conversion({ analysis, onRestart }: Props) {
  const isViable =
    analysis.recommendation === 'go' || analysis.recommendation === 'go-with-changes'

  const subject = encodeURIComponent(
    isViable
      ? `Consultoria — ${analysis.foodType} em ${analysis.city}`
      : `Alternativas — ${analysis.foodType} em ${analysis.city}`
  )
  const body = encodeURIComponent(
    `Nota de viabilidade: ${analysis.viabilityScore}/10\nRecomendação: ${analysis.recommendation}\nCidade: ${analysis.city}, ${analysis.neighborhood}`
  )

  return (
    <div className="space-y-8">
      {isViable ? (
        <>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-500 mb-2">
              Próximos passos
            </p>
            <h1 className="text-2xl font-bold mb-1">O caminho está aberto</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              O relatório indica viabilidade. Agora é hora de transformar análise em plano concreto de execução.
            </p>
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-5">
            <div>
              <h3 className="font-bold text-zinc-100 mb-1">Quer um plano de negócios personalizado?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Nossa equipe pode construir um plano detalhado com projeções financeiras mensais, estratégia de
                lançamento, cronograma de abertura e checklist de licenças específico para{' '}
                {analysis.city}.
              </p>
            </div>
            <a
              href={`mailto:consultoria@veredito.app?subject=${subject}&body=${body}`}
              className="block w-full py-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl text-center transition-colors"
            >
              Agendar consultoria gratuita de 30 min
            </a>
            <p className="text-xs text-zinc-600 text-center">Sem compromisso. Primeira conversa é grátis.</p>
          </div>

          {/* Quick checklist */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
              Enquanto isso, comece por aqui
            </h3>
            <ul className="space-y-3">
              {[
                'Pesquise pontos comerciais em ' + analysis.neighborhood + ' e arredores',
                'Solicite orçamentos de reforma e equipamentos a pelo menos 3 fornecedores',
                'Consulte um contador sobre MEI, ME ou LTDA e regime tributário',
                'Abra processo de alvará na Prefeitura de ' + analysis.city,
                'Crie um protótipo do cardápio e teste com 10 potenciais clientes',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300">
                  <span className="text-emerald-500 font-bold mt-0.5 flex-shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500 mb-2">
              Alternativas no setor
            </p>
            <h1 className="text-2xl font-bold mb-1">Este formato tem riscos altos agora</h1>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Com o capital atual e o perfil identificado, o formato original apresenta riscos elevados. Mas há caminhos
              mais seguros para entrar no mercado alimentício.
            </p>
          </div>

          <div className="space-y-3">
            {ALTERNATIVES.map((alt, i) => (
              <div key={i} className="bg-zinc-900 rounded-2xl border border-zinc-800 p-4 flex items-start gap-4">
                <span className="text-2xl mt-0.5">{alt.icon}</span>
                <div>
                  <h3 className="font-semibold text-sm text-zinc-100 mb-1">{alt.title}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{alt.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6 space-y-5">
            <div>
              <h3 className="font-bold text-zinc-100 mb-1">Quer explorar essas alternativas?</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Podemos analisar qual alternativa faz mais sentido para o seu capital, perfil e localização em{' '}
                {analysis.city}.
              </p>
            </div>
            <a
              href={`mailto:consultoria@veredito.app?subject=${subject}&body=${body}`}
              className="block w-full py-4 border border-zinc-700 hover:border-zinc-500 text-zinc-100 font-bold rounded-xl text-center transition-colors"
            >
              Falar com consultor
            </a>
          </div>
        </>
      )}

      <div className="pt-4 border-t border-zinc-800">
        <button
          onClick={onRestart}
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          ← Analisar outra ideia
        </button>
      </div>
    </div>
  )
}
