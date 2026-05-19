import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? '' });

interface AnswerItem {
  question: string;
  answer: string;
}

async function sendBrevoEmail(apiKey: string, body: object): Promise<void> {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const errText = await res.text();
    console.error('[Brevo] send failed:', res.status, errText);
    throw new Error(`Brevo ${res.status}: ${errText}`);
  }
}

export async function POST(req: Request) {
  const { name, email, profile, answersText } = await req.json() as {
    name: string;
    email: string;
    profile: string;
    answersText?: AnswerItem[];
  };

  if (!name || !email || !profile) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error('[Brevo] BREVO_API_KEY not set');
    return NextResponse.json({ error: 'Brevo not configured' }, { status: 500 });
  }

  const sender = { name: 'Ricardo — Brazil Abroad', email: 'ricardo@brazilabroad.com' };

  const answersSummary = answersText
    ?.map((a) => `${a.question}: ${a.answer}`)
    .join('\n') ?? '';

  const answersHtml = answersText
    ?.map((a) => `<p style="margin:6px 0"><strong>${a.question}</strong><br/>${a.answer}</p>`)
    .join('') ?? '';

  const errors: string[] = [];

  // ── EMAIL 1: notificação interna para Ricardo ──────────────────────────
  try {
    await sendBrevoEmail(apiKey, {
      sender,
      to: [{ email: 'ricardo@brazilabroad.com', name: 'Ricardo' }],
      subject: `Novo lead — ${name}`,
      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:600px;padding:24px;color:#1a1a1a">
          <h2 style="margin-bottom:16px">Novo lead — Brazil Abroad</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Perfil:</strong> ${profile.toUpperCase()}</p>
          <hr style="margin:20px 0;border:none;border-top:1px solid #eee"/>
          <h3>Respostas do formulário</h3>
          ${answersHtml}
        </div>
      `,
    });
    console.log('[Brevo] Email interno enviado para ricardo@brazilabroad.com');
  } catch (err) {
    errors.push(`email1: ${String(err)}`);
    console.error('[Brevo] Falha no email interno:', err);
  }

  // ── EMAIL 2: email para o usuário com conteúdo gerado pela IA ──────────
  let aiContent = '';
  try {
    const resp = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content:
            'Você é Ricardo, fundador do Brazil Abroad. Escreva de forma pessoal, didática, encorajadora e profissional. Português brasileiro. Máximo 4 parágrafos curtos. Não use saudação no início — o email já tem "Olá, [Nome]". Não inclua assinatura — ela já está no template.',
        },
        {
          role: 'user',
          content: `Escreva o corpo de um email para ${name}, que fez o assessment da Brazil Abroad. Perfil: ${profile}. Respostas:\n${answersSummary}\n\nAvalie o perfil de forma encorajadora, destaque o potencial e indique o próximo passo concreto para trabalhar no exterior em hospitalidade.`,
        },
      ],
    });
    aiContent = resp.output_text ?? '';
    console.log('[OpenAI] Conteúdo gerado com sucesso');
  } catch (err) {
    console.error('[OpenAI] Erro ao gerar conteúdo:', err);
    aiContent = `Analisamos seu perfil e ficamos animados com o que vimos!\n\nBrasileiros determinados chegam onde querem — e você já deu o primeiro passo fazendo o assessment.\n\nSeu próximo passo é o Teste de Nivelamento gratuito. Leva menos de 15 minutos e vai mostrar exatamente onde focar seu inglês para se destacar nas entrevistas internacionais.`;
  }

  const aiParagraphs = aiContent
    .split('\n\n')
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="color:#444;font-size:15px;line-height:1.75;margin-bottom:18px">${p.replace(/\n/g, '<br/>')}</p>`
    )
    .join('');

  try {
    await sendBrevoEmail(apiKey, {
      sender,
      to: [{ email, name }],
      subject: 'Seu perfil foi analisado — Brazil Abroad',
      htmlContent: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
          <p style="color:#C9963A;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Brazil Abroad</p>
          <h1 style="font-size:26px;font-weight:700;margin:0 0 24px">Olá, ${name} 👋</h1>
          ${aiParagraphs}
          <div style="margin:36px 0">
            <a href="https://www.brazilabroad.com/assessment"
               style="display:block;background:#1A4A6B;color:white;font-weight:700;padding:16px 28px;border-radius:50px;text-decoration:none;font-size:15px;text-align:center;margin-bottom:12px">
              Voltar ao site →
            </a>
            <a href="https://calendly.com/ricardo-rogerios/30min"
               style="display:block;border:2px solid #1A4A6B;color:#1A4A6B;font-weight:700;padding:14px 28px;border-radius:50px;text-decoration:none;font-size:15px;text-align:center">
              Agendar Diagnóstico Gratuito
            </a>
          </div>
          <hr style="margin:32px 0;border:none;border-top:1px solid #eee"/>
          <p style="font-size:13px;color:#777">Ricardo — Brazil Abroad | Fit for Duty</p>
        </div>
      `,
    });
    console.log(`[Brevo] Email usuário enviado para ${email}`);
  } catch (err) {
    errors.push(`email2: ${String(err)}`);
    console.error('[Brevo] Falha no email do usuário:', err);
  }

  if (errors.length === 2) {
    return NextResponse.json({ error: 'Both emails failed', details: errors }, { status: 500 });
  }

  return NextResponse.json({ ok: true, errors: errors.length ? errors : undefined });
}
