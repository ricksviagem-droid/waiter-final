import OpenAI from 'openai'

type Body = {
  conversation: Array<{ role: string; content: string }>
  stats: {
    score: number
    strikes: number
    goodTurns: number
    sessionEnded: boolean
    endReason: string
    medal: string
  }
  turnFeedbacks: Array<{
    title: string
    message: string
    betterPhrase: string
    strikeAdded: boolean
    pointsDelta: number
  }>
}

export async function POST(req: Request) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const { conversation, stats, turnFeedbacks }: Body = await req.json()

  const transcript = conversation
    .map((msg) => `${msg.role}: ${msg.content}`)
    .join('\n')

  const feedbackHistory = turnFeedbacks
    .map(
      (f, i) =>
        `Turn ${i + 1} | ${f.title} | strikeAdded=${f.strikeAdded} | pointsDelta=${f.pointsDelta} | ${f.message} | Better phrase: ${f.betterPhrase}`
    )
    .join('\n')

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      {
        role: 'system',
        content: `
You are an evaluator for a luxury restaurant waiter roleplay.

Evaluate the candidate on:
1. English clarity
2. Professionalism
3. Timing
4. Guest impact

Return ONLY valid JSON in this format:
{
  "overallScore": number,
  "english": number,
  "professionalism": number,
  "timing": number,
  "guestImpact": number,
  "verdict": "string",
  "strengths": ["string", "string"],
  "improvements": ["string", "string"],
  "betterPhrase": "string",
  "summary": "string"
}

Rules:
- Scores must be 0 to 10
- Be strict but fair
- If the candidate reached 3 strikes, reflect that strongly
- If the candidate recovered well, mention it
- Keep the verdict short and useful for a recruiter
        `,
      },
      {
        role: 'user',
        content: `
Conversation:
${transcript}

Stats:
${JSON.stringify(stats, null, 2)}

Turn feedback:
${feedbackHistory}
        `,
      },
    ],
  })

  const raw = response.output_text

  try {
    const parsed = JSON.parse(raw)
    return Response.json({ report: parsed })
  } catch {
    return Response.json({
      report: {
        overallScore: 5,
        english: 5,
        professionalism: 5,
        timing: 5,
        guestImpact: 5,
        verdict: 'Partial evaluation only',
        strengths: ['The session was completed with partial usable data.'],
        improvements: ['The evaluation response could not be fully parsed.'],
        betterPhrase:
          'Good evening, sir. Welcome to Grand Lux Café. My name is Ned and I will be taking care of you tonight.',
        summary: raw,
      },
    })
  }
}
