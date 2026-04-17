'use client'

import { useEffect, useRef, useState } from 'react'
import type { SceneResult } from '@/lib/shift/types'
import { jsPDF } from 'jspdf'

interface SceneReview {
  sceneId: number
  guestAsked: string
  youSaid: string
  verdict: 'good' | 'needs-work' | 'wrong'
  rickSays: string
  betterPhrase: string
}

interface ReportData {
  grade: string
  overallVerdict: string
  forbes: Record<string, { score: number; comment: string }>
  strengths: string[]
  improvements: string[]
  sceneReviews: SceneReview[]
  rickScript: string
}

interface Props {
  results: SceneResult[]
  totalScore: number
  maxScore: number
  onRestart: () => void
}

export default function ShiftReport({ results, totalScore, maxScore, onRestart }: Props) {
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [rickAudioUrl, setRickAudioUrl] = useState<string | null>(null)
  const [rickLoading, setRickLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'forbes' | 'rick'>('forbes')
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const percentage = Math.round((totalScore / maxScore) * 100)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/shift/report', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ results, totalScore, maxScore }),
        })
        const data = await res.json()
        setReport(data.report)
      } catch {
        setReport({
          grade: 'Pass',
          overallVerdict: 'Session completed. Full evaluation unavailable.',
          forbes: {
            arrival: { score: 7, comment: 'Adequate.' },
            orderTaking: { score: 7, comment: 'Adequate.' },
            foodService: { score: 7, comment: 'Adequate.' },
            guestRelations: { score: 7, comment: 'Adequate.' },
            tableManagement: { score: 7, comment: 'Adequate.' },
          },
          strengths: ['Completed the shift', 'Maintained composure', 'Professional tone'],
          improvements: ['Refine Forbes sequence', 'Improve language', 'More confidence'],
          sceneReviews: [],
          rickScript: 'Great effort completing the simulation. Keep working on your Forbes SOPs.',
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [results, totalScore, maxScore])

  async function generateRickAudio() {
    if (!report) return
    setRickLoading(true)
    try {
      const res = await fetch('/api/shift/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: report.rickScript, speaker: 'rick' }),
      })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      setRickAudioUrl(url)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.play()
    } catch {
      console.error('Rick audio failed')
    } finally {
      setRickLoading(false)
    }
  }

  function downloadPDF() {
    if (!report) return
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })
    doc.setFillColor(10, 18, 30)
    doc.rect(0, 0, 210, 297, 'F')

    doc.setTextColor(59, 158, 255)
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('SHIFT — Forbes Inspector Report', 20, 25)

    doc.setTextColor(200, 223, 245)
    doc.setFontSize(12)
    doc.text(`Grade: ${report.grade}  |  Score: ${percentage}%  |  ${totalScore}/${maxScore} pts`, 20, 35)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    const verdictLines = doc.splitTextToSize(report.overallVerdict, 170)
    doc.text(verdictLines, 20, 48)

    let y = 60 + verdictLines.length * 5

    doc.setTextColor(59, 158, 255)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Forbes Category Scores', 20, y)
    y += 8

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    for (const [cat, data] of Object.entries(report.forbes)) {
      doc.setTextColor(200, 223, 245)
      const label = cat.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
      doc.text(`${label}: ${data.score}/10`, 20, y)
      doc.setTextColor(120, 160, 190)
      const lines = doc.splitTextToSize(data.comment, 150)
      y += 5
      doc.text(lines, 30, y)
      y += lines.length * 5 + 3
    }

    doc.setTextColor(34, 197, 94)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Strengths', 20, y); y += 7
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    report.strengths.forEach((s) => {
      doc.setTextColor(134, 239, 172)
      doc.text(`• ${s}`, 25, y); y += 6
    })

    y += 3
    doc.setTextColor(245, 158, 11)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Areas for Improvement', 20, y); y += 7
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    report.improvements.forEach((s) => {
      doc.setTextColor(253, 211, 77)
      doc.text(`• ${s}`, 25, y); y += 6
    })

    doc.save('SHIFT-Forbes-Report.pdf')
  }

  function downloadMP3() {
    if (!rickAudioUrl) return
    const a = document.createElement('a')
    a.href = rickAudioUrl
    a.download = 'SHIFT-Rick-Tutor-Report.mp3'
    a.click()
  }

  const gradeColor = (g: string) =>
    g === 'Distinction' ? '#5a9e6e' : g === 'Merit' ? '#c9a84c' : g === 'Pass' ? '#d4820a' : '#c45050'

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, color: '#9a8868', background: '#08060a' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #c9a84c', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p style={{ fontSize: 13 }}>Generating your Forbes report…</p>
      </div>
    )
  }

  if (!report) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#08060a' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(201,168,76,0.18)', background: 'rgba(10,8,5,0.97)', flexShrink: 0, position:'relative' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'linear-gradient(90deg,transparent,rgba(201,168,76,0.5),transparent)' }}/>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#f4f0e8' }}>Simulation Complete</h1>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#9a8868' }}>18 scenes · Forbes performance review</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: gradeColor(report.grade) }}>{report.grade}</div>
            <div style={{ fontSize: 13, color: '#9a8868' }}>{percentage}% · {totalScore}/{maxScore}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(201,168,76,0.15)', background: 'rgba(10,8,5,0.97)', flexShrink: 0 }}>
        {(['forbes', 'rick'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: '12px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: activeTab === tab ? 'rgba(201,168,76,0.08)' : 'transparent',
              color: activeTab === tab ? '#c9a84c' : '#6b5840',
              borderBottom: activeTab === tab ? '2px solid #c9a84c' : '2px solid transparent',
              transition: 'all 0.2s',
            }}
          >
            {tab === 'forbes' ? '🔍 Forbes Inspector' : '🎙 Rick Tutor'}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
        {activeTab === 'forbes' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Verdict */}
            <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, padding: '12px 16px' }}>
              <p style={{ margin: 0, fontSize: 13, color: '#c8b88a', lineHeight: 1.6 }}>{report.overallVerdict}</p>
            </div>

            {/* Category scores */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(report.forbes).map(([cat, data]) => {
                const label = cat.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
                const c = data.score >= 7 ? '#c9a84c' : data.score >= 5 ? '#d4820a' : '#c45050'
                return (
                  <div key={cat} style={{ background: 'rgba(20,15,8,0.8)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 10, padding: '10px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#e8d5a8' }}>{label}</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: c }}>{data.score}/10</span>
                    </div>
                    <div style={{ height: 3, background: 'rgba(201,168,76,0.1)', borderRadius: 4 }}>
                      <div style={{ height: '100%', width: `${data.score * 10}%`, background: `linear-gradient(90deg,${c},${c}aa)`, borderRadius: 4, transition: 'width 1s ease' }} />
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: 11, color: '#9a8868' }}>{data.comment}</p>
                  </div>
                )
              })}
            </div>

            {/* Strengths */}
            <div style={{ background: 'rgba(90,158,110,0.05)', border: '1px solid rgba(90,158,110,0.25)', borderRadius: 10, padding: '10px 14px' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: 13, color: '#5a9e6e' }}>Strengths</h4>
              {report.strengths.map((s, i) => (
                <p key={i} style={{ margin: '4px 0', fontSize: 12, color: '#86c899' }}>✓ {s}</p>
              ))}
            </div>

            {/* Improvements */}
            <div style={{ background: 'rgba(212,130,10,0.05)', border: '1px solid rgba(212,130,10,0.25)', borderRadius: 10, padding: '10px 14px' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: 13, color: '#d4820a' }}>Areas to Improve</h4>
              {report.improvements.map((s, i) => (
                <p key={i} style={{ margin: '4px 0', fontSize: 12, color: '#e8b870' }}>→ {s}</p>
              ))}
            </div>

            <button onClick={downloadPDF} style={{
              padding: '12px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg,#c9a84c,#8b6914)',
              color: '#07050b', fontSize: 14, fontWeight: 800, cursor: 'pointer', letterSpacing: 1,
            }}>
              ↓ Download PDF Report
            </button>
          </div>
        )}

        {activeTab === 'rick' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Rick header + audio */}
            <div style={{ background: 'rgba(59,158,255,0.06)', border: '1px solid #1e3a5f', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div style={{ position:'relative', flexShrink:0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/scenes/rick.jpeg" alt="Rick" style={{ width:44, height:44, borderRadius:'50%', objectFit:'cover', objectPosition:'center 15%', display:'block' }}
                    onError={e => { const el = e.currentTarget; el.style.display='none'; (el.nextSibling as HTMLElement).style.display='flex' }}
                  />
                  <div style={{ width:44, height:44, borderRadius:'50%', background:'linear-gradient(135deg,#0a2a4a,#1a5fa8)', display:'none', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, color:'#fff' }}>R</div>
                  <div style={{ position:'absolute', inset:-2, borderRadius:'50%', border:'2px solid transparent', background:'linear-gradient(#020810,#020810) padding-box, linear-gradient(135deg,#f59e0b,#fcd34d,#b45309) border-box' }} />
                  <div style={{ position:'absolute', bottom:1, right:1, width:10, height:10, borderRadius:'50%', background:'#22c55e', border:'2px solid #020810' }} />
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#fff' }}>Rick — Mentor Feedback</div>
                  <div style={{ fontSize: 11, color: '#7aa8cc' }}>Scene-by-scene English coaching</div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 12, color: '#c8dff5', lineHeight: 1.6, fontStyle: 'italic' }}>
                "{report.rickScript}"
              </p>
            </div>

            {!rickAudioUrl ? (
              <button
                onClick={generateRickAudio}
                disabled={rickLoading}
                style={{
                  padding: '14px', borderRadius: 10, border: 'none',
                  background: rickLoading ? '#1e3a5f' : 'linear-gradient(135deg,#3b9eff,#1a5fa8)',
                  color: '#fff', fontSize: 14, fontWeight: 700, cursor: rickLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}
              >
                {rickLoading
                  ? <><div style={{ width: 18, height: 18, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Generating audio…</>
                  : '▶ Play Rick\'s Audio Feedback'}
              </button>
            ) : (
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => audioRef.current?.play()}
                  style={{ flex: 1, padding: '12px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#3b9eff,#1a5fa8)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  ▶ Play Again
                </button>
                <button
                  onClick={downloadMP3}
                  style={{ flex: 1, padding: '12px', borderRadius: 10, border: '1px solid #1e3a5f', background: 'transparent', color: '#c8dff5', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  ↓ Download MP3
                </button>
              </div>
            )}

            {/* Scene-by-scene reviews */}
            {report.sceneReviews && report.sceneReviews.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <h4 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#3b9eff' }}>Scene-by-Scene Review</h4>
                {report.sceneReviews.map((rev) => {
                  const verdictColor = rev.verdict === 'good' ? '#22c55e' : rev.verdict === 'needs-work' ? '#f59e0b' : '#ef4444'
                  const verdictBg = rev.verdict === 'good' ? 'rgba(34,197,94,0.07)' : rev.verdict === 'needs-work' ? 'rgba(245,158,11,0.07)' : 'rgba(239,68,68,0.07)'
                  const verdictBorder = rev.verdict === 'good' ? '#166534' : rev.verdict === 'needs-work' ? '#92400e' : '#7f1d1d'
                  const verdictLabel = rev.verdict === 'good' ? '✓ Good' : rev.verdict === 'needs-work' ? '~ Needs Work' : '✗ Incorrect'
                  return (
                    <div key={rev.sceneId} style={{ background: verdictBg, border: `1px solid ${verdictBorder}`, borderRadius: 12, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#c8dff5' }}>Scene {rev.sceneId}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: verdictColor, background: `${verdictColor}22`, border: `1px solid ${verdictColor}44`, borderRadius: 20, padding: '2px 8px' }}>{verdictLabel}</span>
                      </div>
                      <div style={{ fontSize: 11, color: '#7aa8cc' }}>
                        <span style={{ fontWeight: 600, color: '#556b82' }}>Guest asked: </span>{rev.guestAsked}
                      </div>
                      <div style={{ fontSize: 11, color: '#7aa8cc' }}>
                        <span style={{ fontWeight: 600, color: '#556b82' }}>You said: </span>
                        <span style={{ fontStyle: 'italic' }}>"{rev.youSaid}"</span>
                      </div>
                      <p style={{ margin: 0, fontSize: 12, color: '#c8dff5', lineHeight: 1.55 }}>{rev.rickSays}</p>
                      {rev.verdict !== 'good' && (
                        <div style={{ background: 'rgba(59,158,255,0.1)', border: '1px solid #1e3a5f', borderRadius: 8, padding: '7px 10px' }}>
                          <span style={{ fontSize: 10, fontWeight: 700, color: '#3b9eff', display: 'block', marginBottom: 3 }}>BETTER PHRASE</span>
                          <p style={{ margin: 0, fontSize: 12, color: '#93c5fd', fontStyle: 'italic' }}>"{rev.betterPhrase}"</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid #1e3a5f', background: 'rgba(10,18,30,0.97)', flexShrink: 0 }}>
        <button
          onClick={onRestart}
          style={{
            width: '100%', padding: '12px', borderRadius: 10, border: '1px solid #1e3a5f',
            background: 'transparent', color: '#7aa8cc', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >
          ↺ Start New Shift
        </button>
      </div>
    </div>
  )
}
