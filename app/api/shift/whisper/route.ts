import OpenAI from 'openai'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: Request) {
  const formData = await req.formData()
  const audio = formData.get('audio') as File | null

  if (!audio) {
    return Response.json({ error: 'No audio file provided' }, { status: 400 })
  }

  const transcription = await client.audio.transcriptions.create({
    model: 'whisper-1',
    file: audio,
    language: 'en',
    prompt:
      'This is a fine dining restaurant waiter speaking to a guest. Hospitality, formal service language.',
  })

  return Response.json({ transcript: transcription.text })
}
