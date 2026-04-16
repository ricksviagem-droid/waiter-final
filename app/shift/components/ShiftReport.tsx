'use client'

import { useEffect, useRef, useState } from 'react'
import type { SceneResult } from '@/lib/shift/types'
import { jsPDF } from 'jspdf'

interface ReportData {
  grade: string
  overallVerdict: string
  forbes: Record<string, { score: number; comment: string }>
  strengths: string[]
  improvements: string[]
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
    g === 'Distinction' ? '#22c55e' : g === 'Merit' ? '#3b9eff' : g === 'Pass' ? '#f59e0b' : '#ef4444'

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16, color: '#c8dff5' }}>
        <div style={{ width: 40, height: 40, border: '4px solid #3b9eff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <p>Generating your Forbes report…</p>
      </div>
    )
  }

  if (!report) return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #1e3a5f', background: 'rgba(10,18,30,0.97)', flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: '#fff' }}>SHIFT Complete</h1>
            <p style={{ margin: '2px 0 0', fontSize: 12, color: '#7aa8cc' }}>18 scenes · Full performance review</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: gradeColor(report.grade) }}>{report.grade}</div>
            <div style={{ fontSize: 13, color: '#7aa8cc' }}>{percentage}% · {totalScore}/{maxScore}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid #1e3a5f', background: 'rgba(10,18,30,0.97)', flexShrink: 0 }}>
        {(['forbes', 'rick'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: '12px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
              background: activeTab === tab ? 'rgba(59,158,255,0.1)' : 'transparent',
              color: activeTab === tab ? '#3b9eff' : '#556b82',
              borderBottom: activeTab === tab ? '2px solid #3b9eff' : '2px solid transparent',
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
            <div style={{ background: 'rgba(59,158,255,0.06)', border: '1px solid #1e3a5f', borderRadius: 12, padding: '12px 16px' }}>
              <p style={{ margin: 0, fontSize: 13, color: '#c8dff5', lineHeight: 1.6 }}>{report.overallVerdict}</p>
            </div>

            {/* Category scores */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {Object.entries(report.forbes).map(([cat, data]) => {
                const label = cat.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase())
                const c = data.score >= 7 ? '#22c55e' : data.score >= 5 ? '#f59e0b' : '#ef4444'
                return (
                  <div key={cat} style={{ background: 'rgba(14,26,42,0.8)', border: '1px solid #1e3a5f', borderRadius: 10, padding: '10px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#c8dff5' }}>{label}</span>
                      <span style={{ fontSize: 16, fontWeight: 700, color: c }}>{data.score}/10</span>
                    </div>
                    <div style={{ height: 4, background: '#1e3a5f', borderRadius: 4 }}>
                      <div style={{ height: '100%', width: `${data.score * 10}%`, background: c, borderRadius: 4, transition: 'width 1s ease' }} />
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: 11, color: '#7aa8cc' }}>{data.comment}</p>
                  </div>
                )
              })}
            </div>

            {/* Strengths */}
            <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid #166534', borderRadius: 10, padding: '10px 14px' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: 13, color: '#22c55e' }}>Strengths</h4>
              {report.strengths.map((s, i) => (
                <p key={i} style={{ margin: '4px 0', fontSize: 12, color: '#86efac' }}>✓ {s}</p>
              ))}
            </div>

            {/* Improvements */}
            <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid #92400e', borderRadius: 10, padding: '10px 14px' }}>
              <h4 style={{ margin: '0 0 8px', fontSize: 13, color: '#f59e0b' }}>Areas to Improve</h4>
              {report.improvements.map((s, i) => (
                <p key={i} style={{ margin: '4px 0', fontSize: 12, color: '#fcd34d' }}>→ {s}</p>
              ))}
            </div>

            <button onClick={downloadPDF} style={{
              padding: '12px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg,#3b9eff,#1a5fa8)',
              color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>
              ↓ Download PDF Report
            </button>
          </div>
        )}

        {activeTab === 'rick' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'rgba(59,158,255,0.06)', border: '1px solid #1e3a5f', borderRadius: 12, padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#3b9eff,#1a5fa8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff' }}>R</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Rick Tutor</div>
                  <div style={{ fontSize: 11, color: '#7aa8cc' }}>Personal feedback audio</div>
                </div>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#c8dff5', lineHeight: 1.6, fontStyle: 'italic' }}>
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
                  : '▶ Play Rick\'s Feedback'}
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
