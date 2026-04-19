import OpenAI from 'openai'
import type { ProfileData, IdeaData } from '@/lib/types'

const MODEL_LABELS: Record<string, string> = {
  physical: 'restaurante físico',
  delivery: 'delivery',
  dark_kitchen: 'dark kitchen',
  hybrid: 'modelo híbrido (físico + delivery)',
}

const EXPERIENCE_LABELS: Record<string, string> = {
  none: 'sem experiência prévia no setor',
  some: '1-2 anos de experiência no setor alimentício',
  experienced: '3-5 anos de experiência no setor alimentício',
  expert: 'mais de 5 anos de experiência no setor alimentício',
}

export async function POST(req: Request) {
  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const { profile, idea }: { profile: ProfileData; idea: IdeaData } = await req.json()

    const systemPrompt = `Você é um analista sênior especializado em viabilidade de negócios no setor foodservice no Brasil. Você tem acesso à internet e DEVE buscar dados reais e atualizados. REGRAS:
1. Use a ferramenta de busca para encontrar dados reais de SEBRAE, ABRASEL, IBGE, prefeituras municipais, ANVISA e pesquisas do setor
2. Retorne APENAS um JSON válido — sem markdown, sem texto antes ou depois do JSON
3. Seja honesto e direto. Se a ideia é arriscada, diga claramente com números reais
4. Todos os valores monetários em reais (R$)
5. As URLs das fontes devem ser reais e verificáveis`

    const userPrompt = `Analise a viabilidade deste negócio e retorne um JSON completo com dados reais buscados agora.

EMPREENDEDOR:
- Experiência: ${EXPERIENCE_LABELS[profile.experience]}
- Disponibilidade: ${profile.hoursPerDay} horas/dia
- Sócio com experiência: ${profile.hasSkilledPartner ? 'Sim' : 'Não'}
- Capital total (inclui reserva de 6 meses): R$ ${profile.totalCapital.toLocaleString('pt-BR')}

NEGÓCIO:
- Tipo de comida: ${idea.foodType}
- Modelo: ${MODEL_LABELS[idea.model] || idea.model}
- Localização: ${idea.neighborhood}, ${idea.city}
- Ticket médio esperado: R$ ${idea.averageTicket}${idea.seats ? `\n- Capacidade: ${idea.seats} lugares` : ''}

DADOS A BUSCAR:
1. Taxa de mortalidade de restaurantes no Brasil (SEBRAE/IBGE — dados dos últimos 2 anos)
2. Custo médio de abertura para ${MODEL_LABELS[idea.model]} em ${idea.city} ou cidades similares
3. Margem líquida média do setor alimentício no Brasil (ABRASEL)
4. Comissão do iFood e principais apps de delivery — impacto real na margem
5. Prazo para alvará e vigilância sanitária em ${idea.city}
6. Análise de sazonalidade para ${idea.foodType} em ${idea.city}
7. Nível de saturação e concorrência em ${idea.neighborhood}

Com base nesses dados e no capital disponível de R$ ${profile.totalCapital.toLocaleString('pt-BR')}, calcule os três cenários.

Retorne EXATAMENTE este JSON (sem markdown, sem texto extra):
{
  "viabilityScore": <número de 0 a 10>,
  "scoreExplanation": "<2-3 frases objetivas explicando a nota>",
  "recommendation": "<'go' se nota >= 7 | 'go-with-changes' se nota 4-6 | 'no-go' se nota < 4>",
  "recommendationText": "<3-4 frases com recomendação clara, honesta e direta>",
  "sectorMortality": { "value": "<dado real>", "source": "<fonte>", "url": "<URL real>" },
  "openingCost": { "value": "<dado real>", "source": "<fonte>", "url": "<URL real>" },
  "sectorMargin": { "value": "<dado real>", "source": "<fonte>", "url": "<URL real>" },
  "ifoodCommission": { "value": "<dado real>", "source": "iFood", "url": "<URL real>" },
  "licenseTime": { "value": "<dado real>", "source": "<fonte>", "url": "<URL real>" },
  "breakEvenPoint": { "value": "<calculado>", "source": "Análise Veredito", "url": "#" },
  "seasonality": { "value": "<dado real>", "source": "<fonte>", "url": "<URL real>" },
  "competition": { "value": "<dado real>", "source": "Google Maps / SEBRAE", "url": "<URL>" },
  "pessimistic": {
    "monthlyRevenue": "<R$>", "netMargin": "<%>", "monthlyProfit": "<R$>",
    "breakEvenMonths": <número>, "description": "<1-2 frases>"
  },
  "realistic": {
    "monthlyRevenue": "<R$>", "netMargin": "<%>", "monthlyProfit": "<R$>",
    "breakEvenMonths": <número>, "description": "<1-2 frases>"
  },
  "optimistic": {
    "monthlyRevenue": "<R$>", "netMargin": "<%>", "monthlyProfit": "<R$>",
    "breakEvenMonths": <número>, "description": "<1-2 frases>"
  },
  "topRisks": [
    { "title": "<risco 1>", "description": "<detalhe>", "severity": "high" },
    { "title": "<risco 2>", "description": "<detalhe>", "severity": "high" },
    { "title": "<risco 3>", "description": "<detalhe>", "severity": "medium" }
  ],
  "improvements": ["<melhoria 1>", "<melhoria 2>", "<melhoria 3>"],
  "city": "${idea.city}",
  "neighborhood": "${idea.neighborhood}",
  "model": "${idea.model}",
  "foodType": "${idea.foodType}"
}`

    const response = await client.responses.create({
      model: 'gpt-4o',
      tools: [{ type: 'web_search_preview' }],
      input: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    })

    let text = response.output_text.trim()
    const codeBlock = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/)
    if (codeBlock) text = codeBlock[1].trim()
    const jsonStart = text.indexOf('{')
    const jsonEnd = text.lastIndexOf('}')
    if (jsonStart !== -1 && jsonEnd !== -1) text = text.slice(jsonStart, jsonEnd + 1)

    const result = JSON.parse(text)
    return Response.json({ result })
  } catch (error) {
    console.error('Veredito analyze error:', error)
    return Response.json({ error: 'Falha na análise. Tente novamente.' }, { status: 500 })
  }
}
