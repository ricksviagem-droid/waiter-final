import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { SignedIn, SignedOut, RedirectToSignIn, useAuth, useUser } from '@clerk/clerk-react'
import { useEffect } from 'react'
import { api, setAuthToken } from '@/lib/api'

import Layout from '@/components/Layout/Layout'
import OnboardingPage from '@/pages/OnboardingPage'
import DashboardPage from '@/pages/DashboardPage'
import SMSReaderPage from '@/pages/SMSReaderPage'
import ChartsPage from '@/pages/ChartsPage'
import TransactionsPage from '@/pages/TransactionsPage'
import ScorePage from '@/pages/ScorePage'
import ChatPage from '@/pages/ChatPage'
import GoalsPage from '@/pages/GoalsPage'
import ReportPage from '@/pages/ReportPage'

function AuthSync() {
  const { getToken } = useAuth()
  const { user } = useUser()

  useEffect(() => {
    if (!user) return
    getToken().then(token => {
      if (token) {
        setAuthToken(token)
        api.users.sync({ email: user.emailAddresses[0]?.emailAddress || '', name: user.fullName || '' })
      }
    })
  }, [user, getToken])

  return null
}

export default function App() {
  return (
    <BrowserRouter>
      <SignedIn>
        <AuthSync />
        <Routes>
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/sms" element={<SMSReaderPage />} />
            <Route path="/charts" element={<ChartsPage />} />
            <Route path="/transactions" element={<TransactionsPage />} />
            <Route path="/score" element={<ScorePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/goals" element={<GoalsPage />} />
            <Route path="/report" element={<ReportPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </BrowserRouter>
  )
}
