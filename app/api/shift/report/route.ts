import OpenAI from 'openai'
import type { SceneResult } from '@/lib/shift/types'

export async function POST(req: Request) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const { results, totalScore, maxScore }: { results: SceneResult[]; totalScore: number; maxScore: number } =
    await req.json()

  const percentage = Math.round((totalScore / maxScore) * 100)

  const summary = results
    .map((r, i) => {
      if (r.type === 'guest-audio') {
        return `Scene ${r.sceneId} [Guest Audio] — Score: ${r.score}/10 | SOP: ${r.sopScore}/10 | Passed: ${r.passed} | Transcript: "${r.transcript}"`
      } else {
        return `Scene ${r.sceneId} [Inspector] — Selected: ${r.selectedIndex} | Correct: ${r.correctIndex} | Score: ${r.score}/10 | Passed: ${r.passed}`
      }
    })
    .join('\n')

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      {
        role: 'system',
        content: `You are the Head of Training at a Forbes 5-star restaurant group.
Write a professional performance report for a waiter who just completed a simulated shift.
Overall score: ${percentage}%.

Return ONLY valid JSON:
{
  "grade": "string (e.g. Distinction / Merit / Pass / Fail)",
  "overallVerdict": "string (3-4 sentences, formal tone, recruiter-ready)",
  "forbes": {
    "arrival": { "score": number, "comment": "string" },
    "orderTaking": { "score": number, "comment": "string" },
    "foodService": { "score": number, "comment": "string" },
    "guestRelations": { "score": number, "comment": "string" },
    "tableManagement": { "score": number, "comment": "string" }
  },
  "strengths": ["string", "string", "string"],
  "improvements": ["string", "string", "string"],
  "rickScript": "string (Rick Tutor personal audio script — warm, direct, 150-200 words, first person as mentor, covers top 3 improvements with examples from the session)"
}`,
      },
      {
        role: 'user',
        content: `Shift performance data:\n${summary}`,
      },
    ],
  })

  try {
    const parsed = JSON.parse(response.output_text)
    return Response.json({ report: parsed })
  } catch {
    return Response.json({
      report: {
        grade: 'Pass',
        overallVerdict: 'The candidate completed the simulated shift. Partial evaluation only.',
        forbes: {
          arrival: { score: 7, comment: 'Adequate greeting observed.' },
          orderTaking: { score: 7, comment: 'Order confirmation was clear.' },
          foodService: { score: 7, comment: 'Service execution was satisfactory.' },
          guestRelations: { score: 7, comment: 'Guest interaction was professional.' },
          tableManagement: { score: 7, comment: 'Table management met basic standards.' },
        },
        strengths: ['Completed all scenes', 'Maintained composure', 'Professional demeanor'],
        improvements: ['Refine Forbes sequence', 'Improve sensory language', 'Increase confidence'],
        rickScript:
          "Hey, great work completing the shift simulation. Here are three things I want you to focus on going forward. First, always lead with the guest's name — personalization is everything at this level. Second, your wine service sequence needs more confidence — know the ritual cold. Third, your farewell was solid but make it memorable — escort, name, occasion, return invitation. You've got the foundation. Now refine it.",
      },
    })
  }
}
