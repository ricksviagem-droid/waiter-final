'use client'

import type { AnalysisResult, ProfileData, IdeaData } from '@/lib/veredito/types'

interface Props {
  analysis: AnalysisResult
  profile: ProfileData
  idea: IdeaData
  isUnlocked: boolean
  onPay: () => void
  onContinue: () => void
}

const MODEL_LABELS: Record<string, string> = {
  physical: 'Restaurante Físico',
  delivery: 'Delivery',
  dark_kitchen: 'Dark Kitchen',
  hybrid: 'Híbrido',
}

const REC_CONFIG = {
  go: {
    label: 'Vai em frente',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-700/40',
    ring: '#34d399',
  },
  'go-with-changes': {
    label: 'Vai, mas muda isso',
    color: 'text-amber-400',
    bg: 'bg-amber-950/40',
    border: 'border-amber-700/40',
    ring: '#f59e0b',
  },
  'no-go': {
    label: 'Não vai',
    color: 'text-red-400',
    bg: 'bg-red-950/40',
    border: 'border-red-700/40',
    ring: '#f87171',
  },
}

const SEVERITY = {
  high: { label: 'Alto', color: 'text-red-400', dot: 'bg-red-500' },
  medium: { label: 'Médio', color: 'text-amber-400', dot: 'bg-amber-500' },
  low: { label: 'Baixo', color: 'text-zinc-400', dot: 'bg-zinc-500' },
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 44
  const circ = 2 * Math.PI * r
  const filled = (score / 10) * circ
  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="#27272a" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black leading-none">{score}</span>
        <span className="text-xs text-zinc-500 mt-0.5">/10</span>
      </div>
    </div>
  )
}

function DataRow({
  label,
  data,
  visible = true,
}: {
  label: string
  data: { value: string; source: string; url: string }
  visible?: boolean
}) {
  return (
    <div className="py-3.5 border-b border-zinc-800/60 last:border-0">
      <div className="flex justify-between items-start gap-4">
        <span className="text-sm text-zinc-400 flex-shrink-0 pt-0.5">{label}</span>
        {visible ? (
          <div className="text-right max-w-[55%]">
            <p className="text-sm font-medium text-zinc-100 leading-snug">{data.value}</p>
            {data.url && data.url !== '#' ? (
              <a
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-500/60 hover:text-amber-400 underline transition-colors"
              >
                {data.source} ↗
              </a>
            ) : (
              <span className="text-xs text-zinc-600">{data.source}</span>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-end gap-1">
            <div className="h-3 w-36 bg-zinc-700/60 rounded blur-sm" />
            <div className="h-2 w-20 bg-zinc-800/60 rounded blur-sm" />
          </div>
        )}
      </div>
    </div>
  )
}

function ScenarioCard({
  title,
  scenario,
  variant,
}: {
  title: string
  scenario: { monthlyRevenue: string; netMargin: string; monthlyProfit: string; breakEvenMonths: number; description: string }
  variant: 'pessimistic' | 'realistic' | 'optimistic'
}) {
  const styles = {
    pessimistic: 'border-red-900/50 bg-red-950/20',
    realistic: 'border-zinc-700/60 bg-zinc-900/40',
    optimistic: 'border-emerald-900/50 bg-emerald-950/20',
  }
  const titleColor = {
    pessimistic: 'text-red-400',
    realistic: 'text-zinc-400',
    optimistic: 'text-emerald-400',
  }

  return (
    <div className={`rounded-xl border p-4 ${styles[variant]}`}>
      <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${titleColor[variant]}`}>{title}</p>
      <div className="space-y-2 mb-3">
        {[
          { k: 'Receita mensal', v: scenario.monthlyRevenue },
          { k: 'Margem líquida', v: scenario.netMargin },
          { k: 'Resultado mensal', v: scenario.monthlyProfit },
          { k: 'Break-even', v: `${scenario.breakEvenMonths} meses` },
        ].map(({ k, v }) => (
          <div key={k} className="flex justify-between">
            <span className="text-xs text-zinc-500">{k}</span>
            <span className="text-sm font-semibold text-zinc-100">{v}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-zinc-500 border-t border-zinc-800/50 pt-3 leading-relaxed">
        {scenario.description}
      </p>
    </div>
  )
}

async function downloadPDF(analysis: AnalysisResult, idea: IdeaData) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const w = doc.internal.pageSize.getWidth()
  const margin = 20
  let y = margin

  const addText = (text: string, size: number, bold = false, color: [number, number, number] = [240, 240, 240]) => {
    doc.setFontSize(size)
    doc.setFont('helvetica', bold ? 'bold' : 'normal')
    doc.setTextColor(...color)
    const lines = doc.splitTextToSize(text, w - margin * 2)
    doc.text(lines, margin, y)
    y += (lines.length * size * 0.4) + 3
    return lines.length
  }

  // Dark background
  doc.setFillColor(10, 10, 15)
  doc.rect(0, 0, w, doc.internal.pageSize.getHeight(), 'F')

  // Header
  doc.setFillColor(245, 158, 11)
  doc.rect(0, 0, w, 12, 'F')
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(20, 20, 20)
  doc.text('VEREDITO — Relatório de Viabilidade', margin, 8)
  y = 22

  addText(`${analysis.foodType} · ${MODEL_LABELS[analysis.model] || analysis.model} · ${analysis.neighborhood}, ${analysis.city}`, 10, false, [150, 150, 150])
  y += 4

  addText(`Nota de Viabilidade: ${analysis.viabilityScore}/10`, 18, true, [245, 158, 11])
  addText(analysis.scoreExplanation, 10, false, [180, 180, 180])
  y += 4

  addText('Recomendação Final', 13, true, [245, 158, 11])
  addText(analysis.recommendationText, 10, false, [200, 200, 200])
  y += 6

  addText('Dados do Setor', 13, true, [245, 158, 11])
  const dataPoints: [string, string][] = [
    ['Mortalidade do setor', analysis.sectorMortality.value],
    ['Custo de abertura', analysis.openingCost.value],
    ['Margem do setor', analysis.sectorMargin.value],
    ['Comissão iFood', analysis.ifoodCommission.value],
    ['Licenças', analysis.licenseTime.value],
    ['Ponto de equilíbrio', analysis.breakEvenPoint.value],
    ['Sazonalidade', analysis.seasonality.value],
    ['Concorrência', analysis.competition.value],
  ]
  for (const [k, v] of dataPoints) {
    if (y > 250) { doc.addPage(); doc.setFillColor(10, 10, 15); doc.rect(0, 0, w, doc.internal.pageSize.getHeight(), 'F'); y = margin }
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(150, 150, 150)
    doc.text(k + ':', margin, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(220, 220, 220)
    const lines = doc.splitTextToSize(v, w - margin * 2 - 40)
    doc.text(lines, margin + 40, y)
    y += lines.length * 4 + 2
  }
  y += 4

  if (y > 220) { doc.addPage(); doc.setFillColor(10, 10, 15); doc.rect(0, 0, w, doc.internal.pageSize.getHeight(), 'F'); y = margin }
  addText('Cenários Projetados', 13, true, [245, 158, 11])
  for (const [title, sc] of [['Pessimista', analysis.pessimistic], ['Realista', analysis.realistic], ['Otimista', analysis.optimistic]] as const) {
    addText(title, 11, true, [200, 200, 200])
    addText(`Receita: ${sc.monthlyRevenue} · Margem: ${sc.netMargin} · Resultado: ${sc.monthlyProfit} · Break-even: ${sc.breakEvenMonths} meses`, 9, false, [160, 160, 160])
    addText(sc.description, 9, false, [140, 140, 140])
    y += 2
  }
  y += 4

  if (y > 220) { doc.addPage(); doc.setFillColor(10, 10, 15); doc.rect(0, 0, w, doc.internal.pageSize.getHeight(), 'F'); y = margin }
  addText('Os 3 Maiores Riscos', 13, true, [245, 158, 11])
  analysis.topRisks.forEach((risk, i) => {
    addText(`${i + 1}. ${risk.title} (${risk.severity === 'high' ? 'Alto' : risk.severity === 'medium' ? 'Médio' : 'Baixo'})`, 10, true, [220, 220, 220])
    addText(risk.description, 9, false, [150, 150, 150])
    y += 2
  })
  y += 4

  if (y > 220) { doc.addPage(); doc.setFillColor(10, 10, 15); doc.rect(0, 0, w, doc.internal.pageSize.getHeight(), 'F'); y = margin }
  addText('O que Mudar para Aumentar a Viabilidade', 13, true, [245, 158, 11])
  analysis.improvements.forEach((imp, i) => {
    addText(`→ ${imp}`, 9, false, [180, 180, 180])
  })

  doc.save(`relatorio-veredito-${idea.foodType.toLowerCase().replace(/\s+/g, '-')}.pdf`)
}

export default function Step4Report({ analysis, profile, idea, isUnlocked, onPay, onContinue }: Props) {
  const rec = REC_CONFIG[analysis.recommendation] ?? REC_CONFIG['go-with-changes']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">
          {idea.foodType} · {MODEL_LABELS[idea.model] || idea.model} · {idea.neighborhood}, {idea.city}
        </p>
        <h1 className="text-2xl font-bold">Relatório de Viabilidade</h1>
      </div>

      {/* Score card — always visible */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
        <div className="flex flex-col items-center gap-4">
          <ScoreRing score={analysis.viabilityScore} color={rec.ring} />
          <span className={`px-4 py-1.5 rounded-full border text-sm font-bold ${rec.color} ${rec.bg} ${rec.border}`}>
            {rec.label}
          </span>
          <p className="text-sm text-zinc-400 text-center leading-relaxed max-w-sm">
            {analysis.scoreExplanation}
          </p>
        </div>
      </div>

      {/* Data points */}
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-1">Dados do setor</h3>
        <DataRow label="Mortalidade do setor" data={analysis.sectorMortality} />
        <DataRow label="Custo de abertura" data={analysis.openingCost} visible={isUnlocked} />
        <DataRow label="Margem do setor" data={analysis.sectorMargin} visible={isUnlocked} />
        <DataRow label="Comissão iFood / apps" data={analysis.ifoodCommission} visible={isUnlocked} />
        <DataRow label="Tempo para licenças" data={analysis.licenseTime} visible={isUnlocked} />
        <DataRow label="Ponto de equilíbrio" data={analysis.breakEvenPoint} visible={isUnlocked} />
        <DataRow label="Sazonalidade" data={analysis.seasonality} visible={isUnlocked} />
        <DataRow label="Concorrência local" data={analysis.competition} visible={isUnlocked} />
      </div>

      {/* Paywall or full report */}
      {!isUnlocked ? (
        <div className="relative rounded-2xl overflow-hidden">
          {/* Blurred preview */}
          <div className="pointer-events-none select-none blur-sm opacity-40 space-y-4">
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 h-56" />
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 h-40" />
            <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5 h-32" />
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/60 via-zinc-950/85 to-zinc-950 flex flex-col items-center justify-end pb-8 px-6">
            <div className="text-center mb-6 space-y-2">
              <p className="text-base font-semibold text-zinc-100">Libere o relatório completo</p>
              <p className="text-sm text-zinc-400 max-w-xs mx-auto leading-relaxed">
                Cenários financeiros detalhados, os 3 maiores riscos e a recomendação final com base em dados reais.
              </p>
            </div>
            <button
              onClick={onPay}
              className="w-full max-w-sm py-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 rounded-2xl font-bold text-lg transition-colors"
            >
              Liberar relatório completo
              <span className="block text-sm font-normal opacity-75 mt-0.5">R$ 97,00 · pagamento único</span>
            </button>
            <p className="text-xs text-zinc-600 mt-3">
              Acesso vitalício ao relatório · Stripe · 100% seguro
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Scenarios */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Cenários projetados</h3>
            <div className="space-y-3">
              <ScenarioCard title="Pessimista" scenario={analysis.pessimistic} variant="pessimistic" />
              <ScenarioCard title="Realista" scenario={analysis.realistic} variant="realistic" />
              <ScenarioCard title="Otimista" scenario={analysis.optimistic} variant="optimistic" />
            </div>
          </div>

          {/* Risks */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Os 3 maiores riscos</h3>
            <div className="space-y-5">
              {analysis.topRisks.map((risk, i) => {
                const sev = SEVERITY[risk.severity] ?? SEVERITY.medium
                return (
                  <div key={i}>
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${sev.dot}`} />
                      <h4 className="text-sm font-semibold text-zinc-100 flex-1">{risk.title}</h4>
                      <span className={`text-xs font-medium ${sev.color}`}>{sev.label}</span>
                    </div>
                    <p className="text-xs text-zinc-400 pl-4 leading-relaxed">{risk.description}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Improvements */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">
              O que mudar para aumentar a viabilidade
            </h3>
            <ul className="space-y-3">
              {analysis.improvements.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-zinc-300 leading-relaxed">
                  <span className="text-amber-500 font-bold mt-0.5 flex-shrink-0">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Final recommendation */}
          <div className={`rounded-2xl border p-5 ${rec.bg} ${rec.border}`}>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">Recomendação final</p>
            <p className={`text-xl font-black mb-3 ${rec.color}`}>{rec.label}</p>
            <p className="text-sm text-zinc-300 leading-relaxed">{analysis.recommendationText}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => downloadPDF(analysis, idea)}
              className="flex-1 py-4 border border-zinc-700 text-zinc-300 font-semibold rounded-xl hover:border-zinc-500 hover:text-zinc-100 transition-colors text-sm"
            >
              ↓ Baixar PDF
            </button>
            <button
              onClick={onContinue}
              className="flex-1 py-4 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl transition-colors"
            >
              Próximos passos →
            </button>
          </div>
        </>
      )}
    </div>
  )
}
