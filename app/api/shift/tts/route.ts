import OpenAI from 'openai'

const VOICE_MAP: Record<string, string> = {
  american_male: 'onyx',
  american_female: 'nova',
  british_male: 'echo',
  british_female: 'shimmer',
  french_male: 'fable',
  french_female: 'shimmer',
  italian_male: 'fable',
  italian_female: 'nova',
  japanese_male: 'alloy',
  japanese_female: 'nova',
  arabic_male: 'onyx',
  arabic_female: 'shimmer',
  brazilian_male: 'fable',
  brazilian_female: 'nova',
  german_male: 'echo',
  german_female: 'alloy',
  russian_male: 'onyx',
  russian_female: 'shimmer',
  rick: 'echo',
}

export async function POST(req: Request) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const { text, nationality, gender, speaker } = await req.json()

  const key = speaker === 'rick' ? 'rick' : `${nationality}_${gender}`
  const voice = VOICE_MAP[key] ?? 'alloy'

  try {
    const params: Record<string, unknown> = {
      model: 'gpt-4o-mini-tts',
      voice,
      input: text,
      speed: 1.0,
    }
    if (speaker === 'rick') {
      params.instructions = 'Speak warmly and naturally as Rick, a seasoned Forbes 5-star hospitality mentor coaching a trainee waiter. Use a conversational, encouraging tone with genuine warmth and natural pacing.'
    }
    const mp3 = await (client.audio.speech.create as (p: Record<string, unknown>) => Promise<{ arrayBuffer(): Promise<ArrayBuffer> }>)(params)
    const buffer = Buffer.from(await mp3.arrayBuffer())
    return new Response(buffer, {
      headers: { 'Content-Type': 'audio/mpeg', 'Content-Length': buffer.length.toString() },
    })
  } catch {
    // Fallback to tts-1-hd
    const mp3 = await client.audio.speech.create({ model: 'tts-1-hd', voice: voice as 'echo', input: text, speed: 1.0 })
    const buffer = Buffer.from(await mp3.arrayBuffer())
    return new Response(buffer, {
      headers: { 'Content-Type': 'audio/mpeg', 'Content-Length': buffer.length.toString() },
    })
  }
}
