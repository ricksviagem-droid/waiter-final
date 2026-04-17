import OpenAI from 'openai'

export async function POST(req: Request) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const { transcript, question, skipped }: { transcript: string; question: string; skipped: boolean } = await req.json()

  if (skipped || !transcript.trim()) {
    return Response.json({
      score: 0,
      verdict: 'skipped',
      rickFeedback: "You didn't answer this question. In a real interview, always attempt a response — even a brief one shows initiative and composure.",
      betterAnswer: '',
    })
  }

  const response = await new OpenAI({ apiKey: process.env.OPENAI_API_KEY }).responses.create({
    model: 'gpt-4.1-mini',
    input: [
      {
        role: 'system',
        content: `You are Rick, a Forbes 5-star hospitality mentor evaluating a luxury restaurant job interview answer. Be warm but professional.

Interview question: "${question}"

Evaluate the candidate's answer on:
- English clarity, fluency, and vocabulary
- Relevance and completeness of the answer
- Demonstrated knowledge of luxury hospitality standards
- Professionalism and confidence of tone

Return ONLY valid JSON:
{
  "score": number (0-10),
  "verdict": "strong" | "good" | "weak",
  "rickFeedback": "string (2-3 sentences, warm mentor tone, specific to their words — mention what worked and what to improve)",
  "betterAnswer": "string (model answer in 2-3 sentences, how a top candidate would answer)"
}`,
      },
      { role: 'user', content: `Candidate answered: "${transcript}"` },
    ],
  })

  try {
    return Response.json(JSON.parse(response.output_text))
  } catch {
    return Response.json({ score: 5, verdict: 'good', rickFeedback: 'Adequate response. Keep refining your phrasing.', betterAnswer: '' })
  }
}
