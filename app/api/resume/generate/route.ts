import OpenAI from 'openai'

export interface ResumeData {
  name: string
  title: string
  summary: string
  competencies: string[]
  experience: Array<{
    role: string
    company: string
    period: string
    bullets: string[]
  }>
  education: Array<{ degree: string; institution: string; year: string }>
  languages: string[]
  additionalSkills: string[]
  certifications?: string[]
}

export async function POST(req: Request) {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const body = await req.json()
  const { mode, formData, cvText } = body as {
    mode: 'generate' | 'improve'
    formData?: {
      name: string
      role: string
      experience: string
      skills: string
      languages: string
      target: string
      highlights: string
    }
    cvText?: string
  }

  const systemPrompt = `You are an expert hospitality career consultant who writes world-class CVs for waiters, sommeliers, and F&B professionals targeting luxury hotels, Michelin-starred restaurants, cruise lines, and 5-star establishments worldwide.

Return ONLY a valid JSON object — no markdown, no explanation.

JSON format:
{
  "name": "Full Name",
  "title": "Professional title / target role",
  "summary": "3–4 sentence professional summary highlighting key strengths and career goals",
  "competencies": ["skill 1", "skill 2", ... up to 12 core competencies],
  "experience": [
    {
      "role": "Job Title",
      "company": "Restaurant / Hotel Name",
      "period": "Month Year – Month Year",
      "bullets": ["achievement/responsibility 1", "achievement/responsibility 2", "achievement/responsibility 3"]
    }
  ],
  "education": [
    { "degree": "Qualification name", "institution": "School/University", "year": "Year" }
  ],
  "languages": ["English – C1 (Professional)", "Portuguese – Native"],
  "additionalSkills": ["MICROS POS", "Wine service", "Allergen management"],
  "certifications": ["WSET Level 2", "Food Safety Level 3"]
}

Rules:
- Use strong action verbs (Delivered, Elevated, Managed, Coordinated, Achieved)
- Quantify achievements where possible (e.g. "Managed service for tables of up to 120 covers")
- Tailor language for international luxury hospitality
- Write in British English
- Make it ATS-friendly (Applicant Tracking Systems)
- Be realistic — don't fabricate specific companies or qualifications not mentioned
- Experience bullets should be results-focused, not task-focused`

  let userContent = ''
  if (mode === 'generate' && formData) {
    userContent = `Generate a professional hospitality CV for this candidate:
Name: ${formData.name || '[Candidate Name]'}
Current/desired role: ${formData.role}
Experience: ${formData.experience}
Key skills: ${formData.skills}
Languages: ${formData.languages}
Target establishments: ${formData.target}
Notable highlights: ${formData.highlights || 'None specified'}`
  } else if (mode === 'improve' && cvText) {
    userContent = `Rewrite this CV into a world-class hospitality resume in professional British English.

STRICT RULES — you MUST follow these:
- Use ONLY the information present in the original CV below. Do NOT add, invent, or assume any experience, company names, dates, qualifications, or achievements that are not explicitly stated.
- If a field (e.g. education, certifications) is not mentioned in the CV, return an empty array for that field.
- Preserve all real dates, job titles, and employer names exactly as given.
- You may improve the language, grammar, and structure — but never fabricate content.
- Enhance descriptions with strong action verbs and professional phrasing based ONLY on what is already there.

ORIGINAL CV:
${cvText.slice(0, 8000)}`
  } else {
    return Response.json({ error: 'Invalid request' }, { status: 400 })
  }

  try {
    const response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userContent },
      ],
    })

    const raw = response.output_text.trim()
    const cleaned = raw.startsWith('{') ? raw : raw.slice(raw.indexOf('{'))
    const resume: ResumeData = JSON.parse(cleaned)
    return Response.json({ resume })
  } catch {
    return Response.json({ error: 'Failed to generate resume' }, { status: 500 })
  }
}
