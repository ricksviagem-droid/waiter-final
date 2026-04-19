'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { ProfileData, IdeaData, AnalysisResult } from '@/lib/types'
import ProgressBar from './ProgressBar'
import Step1Profile from './Step1Profile'
import Step2Idea from './Step2Idea'
import Step3Analyzing from './Step3Analyzing'
import Step4Report from './Step4Report'
import Step5Conversion from './Step5Conversion'

const STORAGE_KEY = 'veredito_session'

export default function VereditorQuiz() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [idea, setIdea] = useState<IdeaData | null>(null)
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)

  useEffect(() => {
    const payment = searchParams.get('payment')
    const sessionId = searchParams.get('session_id')

    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed.analysis) setAnalysis(parsed.analysis)
        if (parsed.profile) setProfile(parsed.profile)
        if (parsed.idea) setIdea(parsed.idea)
      }
    } catch {}

    if (payment === 'success' && sessionId) {
      setIsVerifying(true)
      fetch(`/api/verify?session_id=${sessionId}`)
        .then((r) => r.json())
        .then(({ paid }) => {
          if (paid) setIsUnlocked(true)
          setStep(4)
        })
        .catch(() => setStep(4))
        .finally(() => {
          setIsVerifying(false)
          router.replace('/')
        })
    } else if (payment === 'cancel') {
      setStep(4)
      router.replace('/')
    }
  }, [])

  const runAnalysis = async (profileData: ProfileData, ideaData: IdeaData) => {
    setError(null)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: profileData, idea: ideaData }),
      })
      if (!res.ok) throw new Error('Falha na análise')
      const { result, error: apiErr } = await res.json()
      if (apiErr) throw new Error(apiErr)

      setAnalysis(result)
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ analysis: result, profile: profileData, idea: ideaData })
      )
      setStep(4)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro na análise. Tente novamente.')
      setStep(2)
    }
  }

  const handleProfileSubmit = (data: ProfileData) => {
    setProfile(data)
    setStep(2)
  }

  const handleIdeaSubmit = (data: IdeaData) => {
    setIdea(data)
    setStep(3)
    runAnalysis(profile!, data)
  }

  const handlePay = async () => {
    setError(null)
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const { url, error: payErr } = await res.json()
      if (payErr) throw new Error(payErr)
      window.location.href = url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar pagamento.')
    }
  }

  const handleRestart = () => {
    sessionStorage.removeItem(STORAGE_KEY)
    setStep(1)
    setProfile(null)
    setIdea(null)
    setAnalysis(null)
    setIsUnlocked(false)
    setError(null)
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-2 border-amber-500 border-t-transparent animate-spin mx-auto" />
          <p className="text-zinc-400 text-sm">Verificando pagamento...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="sticky top-0 z-10 bg-zinc-950/90 backdrop-blur-sm border-b border-zinc-800/50">
        <div className="max-w-xl mx-auto px-5 py-4 flex items-center justify-between">
          <button onClick={handleRestart} className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center">
              <span className="text-zinc-950 font-black text-xs">V</span>
            </div>
            <span className="font-bold text-base tracking-tight">Veredito</span>
          </button>
          {(step === 1 || step === 2) && <ProgressBar currentStep={step as 1 | 2} />}
        </div>
      </header>

      <main className="max-w-xl mx-auto px-5 py-8">
        {step === 1 && (
          <p className="text-xs text-zinc-600 mb-8 italic">
            "Dados reais. Resposta honesta. Antes de você assinar qualquer coisa."
          </p>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-950/60 border border-red-800/60 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {step === 1 && <Step1Profile onSubmit={handleProfileSubmit} />}
        {step === 2 && <Step2Idea onSubmit={handleIdeaSubmit} onBack={() => setStep(1)} />}
        {step === 3 && <Step3Analyzing />}
        {step === 4 && analysis && (
          <Step4Report
            analysis={analysis}
            profile={profile!}
            idea={idea!}
            isUnlocked={isUnlocked}
            onPay={handlePay}
            onContinue={() => setStep(5)}
          />
        )}
        {step === 5 && analysis && (
          <Step5Conversion analysis={analysis} onRestart={handleRestart} />
        )}
      </main>
    </div>
  )
}
