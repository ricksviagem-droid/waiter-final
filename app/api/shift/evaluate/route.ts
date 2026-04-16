import OpenAI from 'openai'
import type { GuestAudioScene } from '@/lib/shift/types'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const { transcript, scene }: { transcript: string; scene: GuestAudioScene } = await req.json()

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      {
        role: 'system',
        content: `You are a Forbes 5-star hospitality evaluator assessing a waiter's spoken response.

Evaluation criteria: ${scene.evaluationCriteria}
SOP Reference: ${scene.sopReference}

Return ONLY valid JSON:
{
  "score": number (0-10),
  "sopScore": number (0-10),
  "feedback": "string (2 sentences max, direct and professional)",
  "betterPhrase": "string (exact example of ideal response)",
  "passed": boolean (true if score >= 6)
}

Be strict. Forbes 5-star is uncompromising. Score 10 only for exceptional responses.`,
      },
      {
        role: 'user',
        content: `Scene: ${scene.situation}

Guest said: "${scene.guestAudio}"

Waiter responded: "${transcript}"

Evaluate this response.`,
      },
    ],
  })

  try {
    const parsed = JSON.parse(response.output_text)
    return Response.json(parsed)
  } catch {
    return Response.json({
      score: 5,
      sopScore: 5,
      feedback: 'Response received. Partial evaluation only.',
      betterPhrase: 'Good evening. Allow me to assist you with that right away.',
      passed: false,
    })
  }
}
