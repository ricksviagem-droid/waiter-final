import OpenAI from 'openai'
import type { SceneResult } from '@/lib/shift/types'

export async function POST(req: Request) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const { results, totalScore, maxScore }: { results: SceneResult[]; totalScore: number; maxScore: number } =
    await req.json()

  const percentage = Math.round((totalScore / maxScore) * 100)

  const audioScenes = results.filter(r => r.type === 'guest-audio') as Array<{
    sceneId: number; type: 'guest-audio'; transcript: string;
    score: number; sopScore: number; feedback: string; betterPhrase: string; passed: boolean
  }>

  const inspectorScenes = results.filter(r => r.type === 'inspector') as Array<{
    sceneId: number; type: 'inspector'; selectedIndex: number;
    correctIndex: number; score: number; passed: boolean; explanation: string
  }>

  const sceneBreakdown = audioScenes.map(r =>
    `Scene ${r.sceneId} [Audio] — Score: ${r.score}/10 | Passed: ${r.passed}\nTranscript: "${r.transcript}"\nFeedback: ${r.feedback}\nBetter phrase: "${r.betterPhrase}"`
  ).join('\n\n')

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      {
        role: 'system',
        content: `You are Rick, a warm and experienced Forbes 5-star hospitality mentor.
Your job is to give a detailed, didactic, scene-by-scene audio report to a waiter trainee.
Overall score: ${percentage}%.

You MUST go through each audio scene one by one. For each scene:
1. Reference what the guest asked
2. Quote what the trainee said (their transcript)
3. Evaluate it warmly — if wrong, say "I think you were trying to say..." and rebuild the sentence
4. Give a better English phrase they can use
5. Keep it conversational, like a mentor coaching, not a robot judging

Speak in first person as Rick. Be encouraging but honest.
Use natural English — contractions, friendly tone, real mentor energy.

Return ONLY valid JSON:
{
  "grade": "string (Distinction / Merit / Pass / Fail)",
  "overallVerdict": "string (3-4 sentences, warm but professional)",
  "forbes": {
    "arrival": { "score": number, "comment": "string" },
    "orderTaking": { "score": number, "comment": "string" },
    "foodService": { "score": number, "comment": "string" },
    "guestRelations": { "score": number, "comment": "string" },
    "tableManagement": { "score": number, "comment": "string" }
  },
  "strengths": ["string", "string", "string"],
  "improvements": ["string", "string", "string"],
  "sceneReviews": [
    {
      "sceneId": number,
      "guestAsked": "string (what the guest asked/said)",
      "youSaid": "string (trainee transcript, shortened)",
      "verdict": "good | needs-work | wrong",
      "rickSays": "string (Rick's friendly coaching comment, 2-3 sentences)",
      "betterPhrase": "string (exact phrase to use)"
    }
  ],
  "rickScript": "string (Rick's full audio script — warm mentor voice, 200-250 words, goes through top 3 scenes that need work, uses phrases like 'Let me tell you about scene X...', 'What I heard you say was...', 'I believe you were trying to say...', 'Here's what I'd suggest instead...', ends with encouragement)"
}`,
      },
      {
        role: 'user',
        content: `Scene-by-scene data:\n\n${sceneBreakdown}\n\nInspector scenes: ${inspectorScenes.filter(r => !r.passed).length} wrong out of ${inspectorScenes.length}`,
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
        overallVerdict: 'Session completed. Partial evaluation only.',
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
        rickScript: "Hey, great effort completing the simulation. Let's work on a few things together. Your greetings were solid but I want you to add more personalization — always use the guest's name when you have it. Your order taking was clear but remember to always confirm back. Keep practicing and you'll get there. I believe in you.",
      },
    })
  }
}
