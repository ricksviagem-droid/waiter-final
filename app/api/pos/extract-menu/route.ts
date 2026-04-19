import OpenAI from 'openai'

const TEXT_TYPES = new Set([
  'text/plain', 'text/markdown', 'text/csv', 'text/tab-separated-values',
  'text/html', 'text/xml', 'application/json',
])

const MAX_FILE_SIZE = 4 * 1024 * 1024 // 4 MB

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })
  if (file.size > MAX_FILE_SIZE) {
    return Response.json({ error: 'File too large (max 4 MB for POS upload)' }, { status: 400 })
  }

  const bytes = await file.arrayBuffer()
  const mimeType = file.type || 'application/octet-stream'

  // Plain text — decode directly, no AI needed
  if (TEXT_TYPES.has(mimeType) || file.name.match(/\.(txt|md|csv|tsv|json|html?)$/i)) {
    const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes)
    return Response.json({ text: text.slice(0, 4000) })
  }

  const isImage = mimeType.startsWith('image/') || file.name.match(/\.(png|jpg|jpeg|webp)$/i)
  const isPdf   = mimeType === 'application/pdf' || file.name.match(/\.pdf$/i)
  const isDocx  = file.name.match(/\.(docx|doc|odt)$/i)

  if (!isImage && !isPdf && !isDocx) {
    return Response.json({ error: 'Use PDF, image (JPG/PNG), DOCX, or plain text.' }, { status: 400 })
  }

  // Keep base64 small: limit to 2 MB of raw bytes before encoding
  const slicedBytes = bytes.byteLength > 2 * 1024 * 1024
    ? bytes.slice(0, 2 * 1024 * 1024)
    : bytes
  const base64 = Buffer.from(slicedBytes).toString('base64')

  const effectiveMime = isPdf ? 'application/pdf'
    : isDocx ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    : (mimeType.startsWith('image/') ? mimeType : 'image/jpeg')

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  try {
    const response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'user',
          content: [
            {
              type: 'input_file' as const,
              filename: file.name,
              file_data: `data:${effectiveMime};base64,${base64}`,
            },
            {
              type: 'input_text' as const,
              text: 'Extract ONLY menu item names from this document. Group them by category (Starters, Mains, Desserts, Drinks/Wines). Return just the names — no descriptions, no prices, no allergens. One item per line, with category headers.',
            },
          ],
        },
      ],
    })

    const text = (response.output_text || '').trim().slice(0, 4000)
    if (!text) return Response.json({ error: 'Could not extract items from file' }, { status: 422 })
    return Response.json({ text })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Extraction failed'
    return Response.json({ error: msg }, { status: 500 })
  }
}
