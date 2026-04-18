import OpenAI from 'openai'

const TEXT_TYPES = new Set([
  'text/plain', 'text/markdown', 'text/csv', 'text/tab-separated-values',
  'text/html', 'text/xml', 'application/json', 'application/xml',
  'text/rtf', 'application/rtf',
])

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null

  if (!file) return Response.json({ error: 'No file provided' }, { status: 400 })
  if (file.size > 20 * 1024 * 1024) return Response.json({ error: 'File too large (max 20MB)' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const mimeType = file.type || 'application/octet-stream'

  // Plain text — no AI needed
  if (TEXT_TYPES.has(mimeType) || file.name.match(/\.(txt|md|csv|tsv|json|xml|rtf|html)$/i)) {
    const text = new TextDecoder('utf-8', { fatal: false }).decode(bytes)
    return Response.json({ text })
  }

  // PDF, images, DOCX — use OpenAI vision to extract content
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const base64 = Buffer.from(bytes).toString('base64')

  // Determine the right MIME type for OpenAI
  const isImage = mimeType.startsWith('image/') || file.name.match(/\.(png|jpg|jpeg|webp|gif|bmp)$/i)
  const isPdf = mimeType === 'application/pdf' || file.name.match(/\.pdf$/i)
  const isDocx = file.name.match(/\.(docx|doc|odt|pptx|ppt|xlsx|xls)$/i)

  if (!isImage && !isPdf && !isDocx) {
    return Response.json({ error: 'Unsupported file format. Please use PDF, image, DOCX, or text files.' }, { status: 400 })
  }

  const effectiveMime = isPdf ? 'application/pdf'
    : isImage ? (mimeType.startsWith('image/') ? mimeType : 'image/jpeg')
    : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

  try {
    const response = await client.responses.create({
      model: 'gpt-4.1',
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
              text: 'Extract ALL menu content from this document. Include every dish name, description, price, allergen information, and any other relevant details. Return as plain structured text, preserving categories and sections. Be thorough — include everything.',
            },
          ],
        },
      ],
    })

    const text = response.output_text?.trim() || ''
    if (!text) return Response.json({ error: 'Could not extract content from file' }, { status: 422 })
    return Response.json({ text })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Extraction failed'
    return Response.json({ error: msg }, { status: 500 })
  }
}
