import OpenAI from 'openai'

export async function POST(req: Request) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const { text, mode } = await req.json() // mode: 'sentence' | 'word'

  const systemPrompt = mode === 'word'
    ? `You are a hospitality English-Portuguese translator. The user will give you a single English word or short phrase from a luxury restaurant context. Reply with ONLY a JSON object: {"pt": "translation", "hint": "brief context in Portuguese, max 8 words"}. No extra text.`
    : `You are a hospitality English-Portuguese translator. Translate the following English sentence to natural Brazilian Portuguese. Reply with ONLY the translation, no explanation, no quotes.`

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: text },
    ],
  })

  const output = response.output_text.trim()

  if (mode === 'word') {
    try {
      const parsed = JSON.parse(output)
      return Response.json(parsed)
    } catch {
      return Response.json({ pt: output, hint: '' })
    }
  }

  return Response.json({ pt: output })
}
