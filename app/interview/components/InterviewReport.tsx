'use client'

import { useEffect, useRef, useState } from 'react'
import type { QuestionResult } from '@/lib/interview/data'

const S = '#7ab0cc'
const SB = 'rgba(122,176,204,0.22)'
const SBG = 'rgba(122,176,204,0.06)'

interface ReportData {
  grade: string
  overallScore: number
  overallVerdict: string
  categories: Record<string, { score: number; comment: string }>
  strengths: string[]
  improvements: string[]
  hrSummary: string
  rickScript: string
}

interface Props {
  results: QuestionResult[]
  onRestart: () => void
}

const CAT_LABELS: Record<string, string> = {
  english: 'English',
  serviceKnowledge: 'Service Knowledge',
  productKnowledge: 'Product Knowledge',
  situationalHandling: 'Situational Handling',
  professionalism: 'Professionalism',
}

export default function InterviewReport({ results, onRestart }: Props) {
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [rickAudioUrl, setRickAudioUrl] = useState<string | null>(null)
  const [rickLoading, setRickLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'answers' | 'hr'>('overview')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/interview/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ results }),
        })
        const data = await res.json()
        setReport(data.report)
      } catch {
        setReport({
          grade: 'Pass', overallScore: 6,
          overallVerdict: 'Interview completed. Partial evaluation only.',
          categories: {
            english: { score: 6, comment: 'Communicates adequately.' },
            serviceKnowledge: { score: 6, comment: 'Basic knowledge demonstrated.' },
            productKnowledge: { score: 6, comment: 'Adequate.' },
            situationalHandling: { score: 6, comment: 'Reasonable responses.' },
            professionalism: { score: 6, comment: 'Professional tone maintained.' },
          },
          strengths: ['Completed the interview', 'Showed initiative', 'Professional demeanor'],
          improvements: ['Expand service knowledge', 'More detail in answers', 'Stronger English vocabulary'],
          hrSummary: 'Candidate completed the interview simulation. Further evaluation recommended.',
          rickScript: "Good effort. Focus on expanding your Forbes service knowledge and deliver answers with more confidence.",
        })
      } finally { setLoading(false) }
    }
    load()
  }, [results])

  async function generateRickAudio() {
    if (!report || rickLoading) return
    setRickLoading(true)
    try {
      const res = await fetch('/api/shift/tts', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: report.rickScript, speaker: 'rick' }),
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setRickAudioUrl(url)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.play()
    } catch {} finally { setRickLoading(false) }
  }

  const gradeColor = (g: string) =>
    g === 'Distinction' ? '#4ade80' : g === 'Merit' ? S : g === 'Pass' ? '#fbbf24' : '#f87171'

  const scoreColor = (s: number) => s >= 7 ? '#4ade80' : s >= 5 ? '#fbbf24' : '#f87171'

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, color: '#4a6a7a', background: '#04060a' }}>
      <div style={{ width: 40, height: 40, border: `3px solid ${S}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ fontSize: 13 }}>Generating your interview report…</p>
    </div>
  )

  if (!report) return null

  const answered = results.filter(r => !r.skipped).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#04060a' }}>

      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid ' + SB, background: 'rgba(6,9,14,0.98)', flexShrink: 0, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${S},transparent)` }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#e4eef4' }}>Interview Complete</h1>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: '#4a6a7a' }}>{answered}/{results.length} answered · Luxury Restaurant</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: gradeColor(report.grade) }}>{report.grade}</div>
            <div style={{ fontSize: 12, color: '#4a6a7a' }}>{report.overallScore}/10</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid ' + SB, background: 'rgba(6,9,14,0.98)', flexShrink: 0 }}>
        {(['overview', 'answers', 'hr'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            flex: 1, padding: '11px', border: 'none', background: 'transparent', cursor: 'pointer',
            fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
            color: activeTab === tab ? S : '#4a6a7a',
            borderBottom: activeTab === tab ? `2px solid ${S}` : '2px solid transparent',
          }}>
            {tab === 'overview' ? 'Overview' : tab === 'answers' ? 'Answers' : 'HR Report'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {activeTab === 'overview' && (<>
          {/* Rick coaching */}
          <div style={{ background: SBG, border: '1px solid ' + SB, borderRadius: 14, padding: '14px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg,transparent,${S},transparent)` }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/scenes/rick.jpeg" alt="Rick" style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', objectPosition: '50% 25%', border: `2px solid ${S}` }}
                onError={e => { const el = e.currentTarget; el.style.display = 'none'; (el.nextSibling as HTMLElement).style.display = 'flex' }}
              />
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(122,176,204,0.15)', display: 'none', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: S }}>R</div>
              <div>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#e4eef4' }}>Rick — Mentor Feedback</div>
                <div style={{ fontSize: 10, color: '#4a6a7a' }}>Personal coaching audio</div>
              </div>
              <button onClick={generateRickAudio} style={{ marginLeft: 'auto', padding: '6px 14px', borderRadius: 20, border: '1px solid ' + SB, background: rickLoading ? SBG : `linear-gradient(135deg,${S},#4a88a8)`, color: rickLoading ? S : '#04060a', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                {rickLoading ? '…' : rickAudioUrl ? '▶ Replay' : '▶ Play'}
              </button>
            </div>
            {rickAudioUrl && <audio controls src={rickAudioUrl} style={{ width: '100%', height: 32 }} />}
            <p style={{ margin: 0, fontSize: 12, color: '#6a8a9a', lineHeight: 1.6, fontStyle: 'italic' }}>"{report.overallVerdict}"</p>
          </div>

          {/* Category scores */}
          <div style={{ background: SBG, border: '1px solid ' + SB, borderRadius: 14, padding: '14px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: S, letterSpacing: 1, marginBottom: 12 }}>CATEGORY SCORES</div>
            {Object.entries(report.categories).map(([key, val]) => (
              <div key={key} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, color: '#a8c8dc' }}>{CAT_LABELS[key] ?? key}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: scoreColor(val.score) }}>{val.score}/10</span>
                </div>
                <div style={{ height: 4, background: 'rgba(122,176,204,0.12)', borderRadius: 2 }}>
                  <div style={{ height: 4, borderRadius: 2, width: `${val.score * 10}%`, background: `linear-gradient(90deg,${scoreColor(val.score)},${scoreColor(val.score)}99)` }} />
                </div>
                <div style={{ fontSize: 11, color: '#4a6a7a', marginTop: 3 }}>{val.comment}</div>
              </div>
            ))}
          </div>

          {/* Strengths & Improvements */}
          {[
            { label: 'Strengths', items: report.strengths, color: '#4ade80' },
            { label: 'Improvements', items: report.improvements, color: '#fbbf24' },
          ].map(({ label, items, color }) => (
            <div key={label} style={{ background: SBG, border: '1px solid ' + SB, borderRadius: 12, padding: '12px 14px' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color, letterSpacing: 1, marginBottom: 8 }}>{label.toUpperCase()}</div>
              {items.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 5 }}>
                  <span style={{ color, fontSize: 12 }}>•</span>
                  <span style={{ fontSize: 12, color: '#a8c8dc', lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </>)}

        {activeTab === 'answers' && results.map((r, i) => (
          <div key={r.questionId} style={{ background: SBG, border: '1px solid ' + SB, borderRadius: 12, padding: '12px 14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 10, color: S, fontWeight: 700 }}>Q{i + 1}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: r.skipped ? '#4a6a7a' : scoreColor(r.score ?? 0) }}>
                {r.skipped ? 'Skipped' : `${r.score ?? 0}/10`}
              </span>
            </div>
            <p style={{ margin: '0 0 6px', fontSize: 12, color: '#a8c8dc', fontStyle: 'italic' }}>"{r.question}"</p>
            {r.videoUrl && !r.skipped && (
              <video src={r.videoUrl} controls playsInline style={{ width: '100%', borderRadius: 8, marginBottom: 6, maxHeight: 140 }} />
            )}
            {r.transcript && (
              <p style={{ margin: '0 0 5px', fontSize: 11, color: '#6a8a9a', lineHeight: 1.5 }}>You: "{r.transcript}"</p>
            )}
            {r.rickFeedback && !r.skipped && (
              <p style={{ margin: '0 0 5px', fontSize: 11, color: '#7aaabb', lineHeight: 1.5 }}>Rick: {r.rickFeedback}</p>
            )}
            {r.betterAnswer && (
              <div style={{ background: 'rgba(122,176,204,0.06)', borderRadius: 6, padding: '6px 8px', marginTop: 4 }}>
                <p style={{ margin: 0, fontSize: 11, color: '#5a8898', fontStyle: 'italic' }}>Better: "{r.betterAnswer}"</p>
              </div>
            )}
          </div>
        ))}

        {activeTab === 'hr' && (
          <div style={{ background: SBG, border: '1px solid ' + SB, borderRadius: 14, padding: '16px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: S, letterSpacing: 1, marginBottom: 10 }}>HR / RECRUITER SUMMARY</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
              {[['Grade', report.grade], ['Overall Score', `${report.overallScore}/10`], ['Questions Answered', `${answered}/${results.length}`], ['Recommendation', report.grade === 'Fail' ? 'Not recommended' : 'Consider for shortlist']].map(([k, v]) => (
                <div key={k} style={{ background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '8px 10px' }}>
                  <div style={{ fontSize: 10, color: '#4a6a7a', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#c8dce8' }}>{v}</div>
                </div>
              ))}
            </div>
            <p style={{ margin: 0, fontSize: 13, color: '#8ab4c8', lineHeight: 1.7 }}>{report.hrSummary}</p>
          </div>
        )}

        <button onClick={onRestart} style={{ width: '100%', padding: '13px', borderRadius: 12, border: '1px solid ' + SB, background: 'transparent', color: '#4a6a7a', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
          ↺ Restart Interview
        </button>
      </div>
    </div>
  )
}
