import { Suspense } from 'react'
import VereditorQuiz from './_components/VereditorQuiz'

function LoadingShell() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
    </div>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingShell />}>
      <VereditorQuiz />
    </Suspense>
  )
}
