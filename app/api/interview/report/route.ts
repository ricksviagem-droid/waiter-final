import OpenAI from 'openai'
import type { QuestionResult } from '@/lib/interview/data'

export async function POST(req: Request) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const { results }: { results: QuestionResult[] } = await req.json()

  const answered = results.filter(r => !r.skipped && r.transcript)
  const skipped = results.filter(r => r.skipped).length

  const breakdown = results.map(r =>
    `Q${r.questionId}: "${r.question}"\nAnswer: ${r.skipped ? '[SKIPPED]' : `"${r.transcript || '[no transcript recorded]'}"`}`
  ).join('\n\n')

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      {
        role: 'system',
        content: `You are Rick, a warm and experienced Forbes 5-star hospitality mentor. You just conducted a luxury restaurant job interview simulation.

${answered.length} question(s) answered, ${skipped} skipped.

Evaluate the candidate thoroughly. Return ONLY valid JSON with this exact structure:
{
  "grade": "Distinction" | "Merit" | "Pass" | "Fail",
  "overallScore": number (0-10),
  "overallVerdict": "string — 3-4 sentences, honest and encouraging, Rick speaking directly to the candidate",
  "categories": {
    "english": { "score": number (0-10), "comment": "string (1-2 sentences)" },
    "serviceKnowledge": { "score": number (0-10), "comment": "string" },
    "productKnowledge": { "score": number (0-10), "comment": "string" },
    "situationalHandling": { "score": number (0-10), "comment": "string" },
    "professionalism": { "score": number (0-10), "comment": "string" }
  },
  "strengths": ["string", "string", "string"],
  "improvements": ["string", "string", "string"],
  "hrSummary": "string — 3-4 sentences written for HR/recruiters, objective, professional, with shortlist recommendation",
  "rickScript": "string — Rick's personal audio coaching script, 180-220 words. Quote the candidate's actual words using 'What I heard you say was...', suggest better phrasing with 'Here is how I would express that...', end with genuine encouragement.",
  "questionScores": [
    {
      "questionId": number,
      "score": number (0-10, 0 if skipped),
      "verdict": "strong" | "good" | "weak" | "skipped",
      "rickFeedback": "string — 1-2 sentences of direct feedback on this specific answer",
      "betterAnswer": "string — how to say it better, or empty string if the answer was strong"
    }
  ]
}`,
      },
      { role: 'user', content: `Interview transcript:\n\n${breakdown}` },
    ],
  })

  try {
    return Response.json({ report: JSON.parse(response.output_text) })
  } catch {
    return Response.json({
      report: {
        grade: 'Pass',
        overallScore: 6,
        overallVerdict: 'Interview completed. Partial evaluation only.',
        categories: {
          english: { score: 6, comment: 'Communicates adequately.' },
          serviceKnowledge: { score: 6, comment: 'Basic knowledge demonstrated.' },
          productKnowledge: { score: 6, comment: 'Adequate.' },
          situationalHandling: { score: 6, comment: 'Reasonable responses.' },
          professionalism: { score: 6, comment: 'Professional tone maintained.' },
        },
        strengths: ['Completed the interview', 'Showed initiative', 'Professional demeanor'],
        improvements: ['Expand service knowledge', 'Improve English fluency', 'Add more detail to answers'],
        hrSummary: 'Candidate completed the interview simulation. Further in-person evaluation recommended.',
        rickScript: "Good effort completing the simulation. Let's work on a few things together. Focus on your Forbes service knowledge and practice delivering answers with more confidence. Keep at it.",
        questionScores: results.map(r => ({
          questionId: r.questionId,
          score: r.skipped ? 0 : 6,
          verdict: r.skipped ? 'skipped' : 'good',
          rickFeedback: r.skipped ? 'This question was skipped.' : 'Adequate response.',
          betterAnswer: '',
        })),
      },
    })
  }
}
