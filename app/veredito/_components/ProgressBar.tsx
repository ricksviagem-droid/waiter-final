interface Props {
  currentStep: 1 | 2
  totalSteps?: number
}

export default function ProgressBar({ currentStep, totalSteps = 5 }: Props) {
  const pct = (currentStep / totalSteps) * 100

  return (
    <div className="flex items-center gap-3">
      <div className="w-24 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-zinc-500">
        {currentStep} de {totalSteps}
      </span>
    </div>
  )
}
