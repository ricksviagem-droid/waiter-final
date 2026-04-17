import OpenAI from 'openai'
import type { QuestionResult } from '@/lib/interview/data'

export async function POST(req: Request) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const { results }: { results: QuestionResult[] } = await req.json()

  const answered = results.filter(r => !r.skipped && r.transcript)
  const skipped = results.filter(r => r.skipped).length

  const breakdown = results.map(r =>
    `Q${r.questionId}: "${r.question}"\nAnswer: ${r.skipped ? '[SKIPPED]' : `"${r.transcript}"`}\nScore: ${r.score ?? 0}/10 | Verdict: ${r.verdict ?? 'skipped'}`
  ).join('\n\n')

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      {
        role: 'system',
        content: `You are Rick, a warm and experienced Forbes 5-star hospitality mentor. You just conducted a luxury restaurant job interview simulation.

${skipped} question(s) were skipped. ${answered.length} were answered.

Return ONLY valid JSON:
{
  "grade": "Distinction" | "Merit" | "Pass" | "Fail",
  "overallScore": number (0-10),
  "overallVerdict": "string (3-4 sentences, honest but encouraging, as Rick speaking directly)",
  "categories": {
    "english": { "score": number, "comment": "string (1-2 sentences)" },
    "serviceKnowledge": { "score": number, "comment": "string" },
    "productKnowledge": { "score": number, "comment": "string" },
    "situationalHandling": { "score": number, "comment": "string" },
    "professionalism": { "score": number, "comment": "string" }
  },
  "strengths": ["string", "string", "string"],
  "improvements": ["string", "string", "string"],
  "hrSummary": "string (3-4 sentences written for HR/recruiters — objective, professional, shortlist recommendation)",
  "rickScript": "string (Rick's warm audio coaching script, 180-220 words, goes through the top 3 answers that need work, uses 'What I heard you say was...', 'I think you were trying to express...', 'Here's how I'd suggest phrasing it...', ends with genuine encouragement)"
}`,
      },
      { role: 'user', content: `Interview results:\n\n${breakdown}` },
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
          serviceKnowledge: { score: 6, comment: 'Basic knowledge shown.' },
          productKnowledge: { score: 6, comment: 'Adequate.' },
          situationalHandling: { score: 6, comment: 'Adequate.' },
          professionalism: { score: 6, comment: 'Professional tone maintained.' },
        },
        strengths: ['Completed the interview', 'Showed initiative', 'Professional demeanor'],
        improvements: ['Expand service knowledge', 'Improve English fluency', 'Add more detail to answers'],
        hrSummary: 'Candidate completed the interview simulation. Further in-person evaluation recommended.',
        rickScript: "Good effort completing the simulation. Let's work on a few things together. Focus on expanding your knowledge of the Forbes service sequence and practice delivering your answers with more confidence. You have a solid foundation — now it's about polishing the delivery. Keep at it.",
      },
    })
  }
}
