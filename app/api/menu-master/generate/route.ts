import OpenAI from 'openai'

export interface MenuQuestion {
  id: string
  question: string
  options: [string, string, string, string]
  correct: number
  reveal: string
  category: string
  points: number
}

export async function POST(req: Request) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const { menuText }: { menuText: string } = await req.json()

  if (!menuText || menuText.trim().length < 30) {
    return Response.json({ error: 'Menu text too short' }, { status: 400 })
  }

  const truncated = menuText.slice(0, 6000)

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      {
        role: 'system',
        content: `You are a hospitality training expert. Given restaurant menu content, generate exactly 15 quiz questions to help staff memorise it. Return ONLY a valid JSON array — no markdown, no explanation.

Format:
[{
  "id": "q1",
  "question": "string — clear question about the menu",
  "options": ["correct answer", "wrong option", "wrong option", "wrong option"],
  "correct": 0,
  "reveal": "string — full explanation of the correct answer (2-3 sentences, informative)",
  "category": "Ingredients|Price|Description|Allergens|Pairing|Preparation|Special",
  "points": 100
}]

Rules:
- Shuffle option order (correct answer is NOT always index 0 — vary the correct index)
- Set "correct" to the actual index of the right answer in options
- Mix categories: ingredients (4q), description (3q), allergens (2q), price (2q if listed), preparation (2q), pairing (2q)
- Make questions progressively harder
- Keep questions specific and testable — no vague questions
- Reveal should teach, not just repeat the answer`,
      },
      { role: 'user', content: `Menu content:\n\n${truncated}` },
    ],
  })

  try {
    const raw = response.output_text.trim()
    const cleaned = raw.startsWith('[') ? raw : raw.slice(raw.indexOf('['))
    const questions: MenuQuestion[] = JSON.parse(cleaned)
    return Response.json({ questions })
  } catch {
    return Response.json({ error: 'Failed to parse menu questions' }, { status: 500 })
  }
}
