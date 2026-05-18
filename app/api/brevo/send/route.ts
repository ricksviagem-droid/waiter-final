import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? '' });

interface AnswerItem {
  question: string;
  answer: string;
}

async function sendBrevoEmail(apiKey: string, body: object) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
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
    return NextResponse.json({ error: 'Brevo not configured' }, { status: 500 });
  }

  const sender = { name: 'Ricardo — Brazil Abroad', email: 'ricardo@brazilabroad.com' };

  const answersSummary = answersText
    ?.map((a) => `${a.question}: ${a.answer}`)
    .join('\n') ?? '';

  // ── EMAIL 1: notificação para Ricardo ──────────────────────────────────
  const answersHtml = answersText
    ?.map((a) => `<p style="margin:4px 0"><strong>${a.question}</strong><br/>${a.answer}</p>`)
    .join('') ?? '';

  await sendBrevoEmail(apiKey, {
    sender,
    to: [{ email: 'ricardo.rogerios@hotmail.com', name: 'Ricardo' }],
    subject: `Novo Assessment — ${name}`,
    htmlContent: `
      <div style="font-family:Arial,sans-serif;max-width:600px;padding:24px;color:#1a1a1a">
        <h2 style="margin-bottom:16px">Novo Assessment recebido</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Perfil:</strong> ${profile.toUpperCase()}</p>
        <hr style="margin:20px 0;border:none;border-top:1px solid #eee"/>
        <h3>Respostas do formulário</h3>
        ${answersHtml}
      </div>
    `,
  });

  // ── EMAIL 2: email para o usuário com conteúdo gerado pela IA ──────────
  let aiContent = '';
  try {
    const resp = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: 'Você é Ricardo, fundador do Brazil Abroad. Escreva de forma pessoal, didática, encorajadora e profissional. Português brasileiro. Máximo 4 parágrafos curtos. Não use saudação no início — o email já tem. Não inclua assinatura — ela já está no template.',
        },
        {
          role: 'user',
          content: `Escreva o corpo de um email para ${name}, que fez o assessment. Perfil determinado: ${profile}. Respostas:\n${answersSummary}\n\nAvalie o perfil de forma encorajadora, mostre o que a pessoa tem de bom e qual o próximo passo concreto para ela trabalhar no exterior em hospitalidade.`,
        },
      ],
    });
    aiContent = resp.output_text ?? '';
  } catch {
    aiContent = `Analisamos seu perfil e estamos animados com o seu potencial!\n\nBrasileiros com determinação chegam onde querem chegar — e você já deu o primeiro passo ao fazer o assessment.\n\nSeu próximo passo é fazer o Teste de Nivelamento gratuito para entendermos melhor seu inglês e montar o plano certo para você.`;
  }

  const aiParagraphs = aiContent
    .split('\n\n')
    .filter(Boolean)
    .map((p) => `<p style="color:#444;font-size:15px;line-height:1.75;margin-bottom:18px">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  await sendBrevoEmail(apiKey, {
    sender,
    to: [{ email, name }],
    subject: 'Seu perfil foi analisado — Brazil Abroad',
    htmlContent: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
        <p style="color:#C9963A;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Brazil Abroad</p>
        <h1 style="font-size:26px;font-weight:700;margin:0 0 24px">Olá, ${name} 👋</h1>
        ${aiParagraphs}
        <div style="margin:36px 0;display:flex;flex-direction:column;gap:12px">
          <a href="https://waiter-final-7bp6.vercel.app" style="display:block;background:#1A4A6B;color:white;font-weight:700;padding:16px 28px;border-radius:50px;text-decoration:none;font-size:15px;text-align:center">
            Fazer Teste de Nivelamento Gratuito →
          </a>
          <a href="https://calendly.com/ricardo-rogerios/30min" style="display:block;border:2px solid #1A4A6B;color:#1A4A6B;font-weight:700;padding:14px 28px;border-radius:50px;text-decoration:none;font-size:15px;text-align:center;margin-top:12px">
            Agendar Consulta Gratuita
          </a>
        </div>
        <hr style="margin:32px 0;border:none;border-top:1px solid #eee"/>
        <p style="font-size:13px;color:#777">
          Ricardo — Brazil Abroad | Fit for Duty
        </p>
      </div>
    `,
  });

  return NextResponse.json({ ok: true });
}
