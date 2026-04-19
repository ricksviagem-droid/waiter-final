import OpenAI from 'openai'
import type { PosMenuItem } from '@/lib/pos/data'

export async function POST(req: Request) {
  const { menuText }: { menuText: string } = await req.json()

  if (!menuText || menuText.trim().length < 20) {
    return Response.json({ error: 'Menu text too short' }, { status: 400 })
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const response = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: [
      {
        role: 'system',
        content: `You are a restaurant POS system configurator. Extract menu items from the provided menu text and categorise them for a MICROS POS terminal.

Return ONLY a valid JSON object — no markdown, no explanation.

Format:
{
  "starter": [{"id":"s1","name":"Full item name","short":"MAX 9 CHARS","category":"starter"}],
  "main":    [{"id":"m1","name":"Full item name","short":"MAX 9 CHARS","category":"main"}],
  "dessert": [{"id":"d1","name":"Full item name","short":"MAX 9 CHARS","category":"dessert"}],
  "drink":   [{"id":"dr1","name":"Full item name","short":"MAX 9 CHARS","category":"drink"}]
}

Rules:
- "short" is the POS button label: MAX 9 characters, ALL CAPS, abbreviated (e.g. "SEA BASS", "WAGYU", "CR BRULEE", "CHABLIS")
- Categorise drinks and wines under "drink"
- Include up to 8 items per category
- If a category has no items, return empty array []
- IDs must be unique: s1,s2... m1,m2... d1,d2... dr1,dr2...`,
      },
      {
        role: 'user',
        content: `Menu:\n\n${menuText.slice(0, 3000)}`,
      },
    ],
  })

  try {
    const raw = response.output_text.trim()
    const cleaned = raw.startsWith('{') ? raw : raw.slice(raw.indexOf('{'))
    const menu: Record<string, PosMenuItem[]> = JSON.parse(cleaned)
    const total = Object.values(menu).flat().length
    if (total === 0) throw new Error('No items found')
    return Response.json({ menu })
  } catch {
    return Response.json({ error: 'Failed to parse menu into POS items' }, { status: 500 })
  }
}
