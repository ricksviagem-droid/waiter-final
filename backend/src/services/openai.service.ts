import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function parseSmsWithAI(smsText: string): Promise<{
  amount: number;
  type: 'debit' | 'credit';
  merchant: string;
  category: string;
}> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Você é um assistente financeiro. Analise a mensagem SMS bancária e extraia as informações. Responda APENAS em JSON válido, sem texto adicional:
{
  "amount": number,
  "type": "debit" | "credit",
  "merchant": string,
  "category": "Alimentação" | "Transporte" | "Moradia" | "Saúde" | "Educação" | "Lazer" | "Compras" | "Serviços" | "Transferência" | "Salário" | "Outros"
}`,
      },
      { role: 'user', content: smsText },
    ],
    max_tokens: 200,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

export async function getFinancialScore(data: {
  safeToSpend: number;
  currentBalance: number;
  monthlyExpenses: number;
  salaryAmount: number;
  loanBalance: number;
  savingsRate: number;
  topCategories: { category: string; total: number }[];
}): Promise<{ score: number; status: string; insights: string[]; sugestao: string }> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Você é um consultor financeiro. Analise os dados financeiros e retorne APENAS JSON válido:
{
  "score": number (0-100),
  "status": "ótimo" | "bom" | "atenção" | "crítico",
  "insights": [string, string, string],
  "sugestao": string
}`,
      },
      { role: 'user', content: `Dados financeiros: ${JSON.stringify(data)}` },
    ],
    max_tokens: 400,
    response_format: { type: 'json_object' },
  });

  return JSON.parse(response.choices[0].message.content || '{}');
}

export async function chatWithAI(
  userMessage: string,
  financialContext: object
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'system',
        content: `Você é o assistente financeiro pessoal do usuário. Você tem acesso aos dados financeiros reais do usuário. Responda de forma clara, direta e empática. Seja específico com números quando relevante. Use português brasileiro.`,
      },
      {
        role: 'user',
        content: `Meus dados financeiros: ${JSON.stringify(financialContext)}\n\nMinha pergunta: ${userMessage}`,
      },
    ],
    max_tokens: 1000,
  });

  return response.choices[0].message.content || '';
}
