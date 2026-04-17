import OpenAI from 'openai'
import type { ScanAnswer, SpeakingAnswer, WritingAnswer } from '@/lib/level-scan/data'

export async function POST(req: Request) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const {
    mcqAnswers, speakingAnswers, writingAnswers,
  }: { mcqAnswers: ScanAnswer[]; speakingAnswers: SpeakingAnswer[]; writingAnswers: WritingAnswer[] } = await req.json()

  const listeningCorrect = mcqAnswers.filter(a => a.type === 'listening' && a.correct_bool).length
  const listeningTotal = mcqAnswers.filter(a => a.type === 'listening').length
  const readingCorrect = mcqAnswers.filter(a => a.type === 'reading' && a.correct_bool).length
  const readingTotal = mcqAnswers.filter(a => a.type === 'reading').length

  const speakingText = speakingAnswers.map((a, i) =>
    `Speaking Q${i + 1}: "${a.transcript || '[no response]'}"`
  ).join('\n')

  const writingText = writingAnswers.map((a, i) =>
    `Writing Q${i + 1}: "${a.text || '[no response]'}"`
  ).join('\n')

  const summary = `
Listening: ${listeningCorrect}/${listeningTotal} correct
Reading: ${readingCorrect}/${readingTotal} correct
${speakingText}
${writingText}
`.trim()

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      {
        role: 'system',
        content: `You are an expert English language assessor using CEFR standards (A1, A2, B1, B2, C1, C2).
Evaluate the candidate's English level based on their performance and return ONLY valid JSON:
{
  "cefr": "A1"|"A2"|"B1"|"B2"|"C1"|"C2",
  "levelName": "ROOKIE"|"EXPLORER"|"CONNECTOR"|"NAVIGATOR"|"MAVERICK"|"LEGEND",
  "overallScore": number (0-100),
  "listeningScore": number (0-100),
  "speakingScore": number (0-100),
  "readingScore": number (0-100),
  "writingScore": number (0-100),
  "verdict": "string — 2-3 sentences, honest and motivating, directly addressing the candidate",
  "strengths": ["string", "string", "string"],
  "improvements": ["string", "string", "string"],
  "studyPlan": "string — concrete 3-step study recommendation based on their level"
}`,
      },
      { role: 'user', content: `Assessment data:\n${summary}` },
    ],
  })

  try {
    return Response.json({ result: JSON.parse(response.output_text) })
  } catch {
    const score = Math.round(((listeningCorrect + readingCorrect) / (listeningTotal + readingTotal)) * 100)
    const cefr = score >= 90 ? 'C1' : score >= 75 ? 'B2' : score >= 55 ? 'B1' : score >= 35 ? 'A2' : 'A1'
    return Response.json({
      result: {
        cefr, levelName: { A1:'ROOKIE', A2:'EXPLORER', B1:'CONNECTOR', B2:'NAVIGATOR', C1:'MAVERICK', C2:'LEGEND' }[cefr],
        overallScore: score, listeningScore: Math.round((listeningCorrect / listeningTotal) * 100),
        speakingScore: 60, readingScore: Math.round((readingCorrect / readingTotal) * 100), writingScore: 60,
        verdict: 'Good effort completing the assessment. Keep practising with real simulations.',
        strengths: ['Attempted all sections', 'Completed the full assessment', 'Showed initiative'],
        improvements: ['Practice listening daily', 'Expand vocabulary', 'Focus on grammar accuracy'],
        studyPlan: '1. Listen to English podcasts for 15 min/day. 2. Practice speaking with Field Sim. 3. Do one writing exercise per day.',
      },
    })
  }
}
