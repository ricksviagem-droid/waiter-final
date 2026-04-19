import OpenAI from 'openai'
import type { ProfileData, IdeaData } from '@/lib/veredito/types'

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

Retorne EXATAMENTE este JSON (sem markdown, sem texto extra antes ou depois):
{
  "viabilityScore": <número de 0 a 10>,
  "scoreExplanation": "<2-3 frases objetivas explicando a nota>",
  "recommendation": "<'go' se nota >= 7 | 'go-with-changes' se nota 4-6 | 'no-go' se nota < 4>",
  "recommendationText": "<3-4 frases com recomendação clara, honesta e direta>",
  "sectorMortality": {
    "value": "<ex: '60% dos restaurantes fecham nos primeiros 5 anos'>",
    "source": "<SEBRAE ou IBGE>",
    "url": "<URL real>"
  },
  "openingCost": {
    "value": "<ex: 'R$ 80.000 a R$ 150.000 para delivery em São Paulo'>",
    "source": "<fonte real>",
    "url": "<URL real>"
  },
  "sectorMargin": {
    "value": "<ex: 'Margem líquida média de 3% a 8% no foodservice brasileiro'>",
    "source": "<ABRASEL ou fonte real>",
    "url": "<URL real>"
  },
  "ifoodCommission": {
    "value": "<ex: 'Comissão de 12% a 27% + taxa de entrega; reduz margem em 10-15 pontos percentuais'>",
    "source": "iFood",
    "url": "<URL real>"
  },
  "licenseTime": {
    "value": "<ex: '60 a 180 dias para alvará sanitário e de funcionamento em ${idea.city}'>",
    "source": "<Prefeitura de ${idea.city} ou ANVISA>",
    "url": "<URL real>"
  },
  "breakEvenPoint": {
    "value": "<ponto de equilíbrio mensal calculado em R$ com base nos dados reais>",
    "source": "Análise Veredito",
    "url": "#"
  },
  "seasonality": {
    "value": "<análise de sazonalidade específica para ${idea.foodType} em ${idea.city}, com meses de pico e baixa>",
    "source": "<IBGE, ABRASEL ou fonte real>",
    "url": "<URL real>"
  },
  "competition": {
    "value": "<análise da concorrência em ${idea.neighborhood}, ${idea.city} — densidade, diferenciação necessária>",
    "source": "Google Maps / SEBRAE",
    "url": "<URL relevante>"
  },
  "pessimistic": {
    "monthlyRevenue": "<ex: 'R$ 18.000'>",
    "netMargin": "<ex: '-8%'>",
    "monthlyProfit": "<ex: '-R$ 1.440'>",
    "breakEvenMonths": <número inteiro>,
    "description": "<1-2 frases descrevendo o cenário pessimista com causas específicas>"
  },
  "realistic": {
    "monthlyRevenue": "<ex: 'R$ 35.000'>",
    "netMargin": "<ex: '5%'>",
    "monthlyProfit": "<ex: 'R$ 1.750'>",
    "breakEvenMonths": <número inteiro>,
    "description": "<1-2 frases>"
  },
  "optimistic": {
    "monthlyRevenue": "<ex: 'R$ 60.000'>",
    "netMargin": "<ex: '12%'>",
    "monthlyProfit": "<ex: 'R$ 7.200'>",
    "breakEvenMonths": <número inteiro>,
    "description": "<1-2 frases>"
  },
  "topRisks": [
    {
      "title": "<título do maior risco específico para este negócio>",
      "description": "<descrição detalhada com números quando possível>",
      "severity": "high"
    },
    {
      "title": "<segundo risco>",
      "description": "<descrição>",
      "severity": "high"
    },
    {
      "title": "<terceiro risco>",
      "description": "<descrição>",
      "severity": "medium"
    }
  ],
  "improvements": [
    "<mudança concreta #1 com maior impacto na viabilidade>",
    "<mudança concreta #2>",
    "<mudança concreta #3>"
  ],
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
    if (jsonStart !== -1 && jsonEnd !== -1) {
      text = text.slice(jsonStart, jsonEnd + 1)
    }

    const result = JSON.parse(text)
    return Response.json({ result })
  } catch (error) {
    console.error('Veredito analyze error:', error)
    return Response.json({ error: 'Falha na análise. Tente novamente.' }, { status: 500 })
  }
}
