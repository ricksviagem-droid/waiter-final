import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? '' });

interface AnswerItem {
  question: string;
  answer: string;
}

function createTransport() {
  return nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: {
      user: 'ricardo@brazilabroad.com',
      pass: process.env.BREVO_API_KEY ?? '',
    },
  });
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

  if (!process.env.BREVO_API_KEY) {
    console.error('[send-email] BREVO_API_KEY not set');
    return NextResponse.json({ error: 'Email not configured' }, { status: 500 });
  }

  const transport = createTransport();

  const answersSummary = answersText
    ?.map((a) => `${a.question}: ${a.answer}`)
    .join('\n') ?? '';

  const answersHtml = answersText
    ?.map((a) => `<p style="margin:6px 0"><strong>${a.question}</strong><br/>${a.answer}</p>`)
    .join('') ?? '';

  const errors: string[] = [];

  // ── EMAIL 2 — interno para Ricardo ──────────────────────────────────────
  try {
    await transport.sendMail({
      from: '"Ricardo — Brazil Abroad" <ricardo@brazilabroad.com>',
      to: 'ricardo@brazilabroad.com',
      subject: `Novo lead — ${name}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;padding:24px;color:#1a1a1a">
          <h2 style="margin-bottom:16px">Novo lead — Brazil Abroad</h2>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Perfil:</strong> ${profile.toUpperCase()}</p>
          <hr style="margin:20px 0;border:none;border-top:1px solid #eee"/>
          <h3>Respostas do Assessment</h3>
          ${answersHtml}
        </div>
      `,
    });
    console.log('[send-email] Email interno enviado para ricardo@brazilabroad.com');
  } catch (err) {
    errors.push(`email_interno: ${String(err)}`);
    console.error('[send-email] Falha no email interno:', err);
  }

  // ── EMAIL 1 — para o usuário com avaliação da OpenAI ────────────────────
  let aiContent = '';
  try {
    const resp = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content:
            'Você é Ricardo, fundador do Brazil Abroad. Escreva de forma pessoal, encorajadora e profissional. Português brasileiro. Máximo 4 parágrafos curtos. Não use saudação no início — o email já tem "Olá, [Nome]". Não inclua assinatura — ela já está no template.',
        },
        {
          role: 'user',
          content: `Escreva o corpo de um email para ${name}, que fez o assessment da Brazil Abroad. Perfil: ${profile}. Respostas:\n${answersSummary}\n\nAvalie o perfil de forma encorajadora, destaque o potencial e indique o próximo passo concreto: agendar o diagnóstico gratuito.`,
        },
      ],
    });
    aiContent = resp.output_text ?? '';
  } catch (err) {
    console.error('[send-email] Erro ao gerar conteúdo OpenAI:', err);
    aiContent = `Analisamos seu perfil e ficamos muito animados com o que vimos!\n\nBrasileiros determinados chegam onde querem — e você já deu o primeiro passo fazendo o assessment.\n\nSeu próximo passo é agendar seu Diagnóstico Gratuito comigo. Em 30 minutos vamos traçar juntos o plano exato para você começar sua carreira internacional.`;
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
    await transport.sendMail({
      from: '"Ricardo — Brazil Abroad" <ricardo@brazilabroad.com>',
      to: email,
      subject: 'Seu perfil foi analisado — Brazil Abroad',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
          <p style="color:#C9963A;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Brazil Abroad</p>
          <h1 style="font-size:26px;font-weight:700;margin:0 0 24px">Olá, ${name} 👋</h1>
          ${aiParagraphs}
          <div style="margin:36px 0">
            <a href="https://calendly.com/ricardo-rogerios/30min"
               style="display:block;background:#1A4A6B;color:white;font-weight:700;padding:16px 28px;border-radius:50px;text-decoration:none;font-size:15px;text-align:center">
              Agendar Diagnóstico Gratuito →
            </a>
          </div>
          <hr style="margin:32px 0;border:none;border-top:1px solid #eee"/>
          <p style="font-size:13px;color:#777">Ricardo — Brazil Abroad | Fit for Duty</p>
        </div>
      `,
    });
    console.log(`[send-email] Email usuário enviado para ${email}`);
  } catch (err) {
    errors.push(`email_usuario: ${String(err)}`);
    console.error('[send-email] Falha no email do usuário:', err);
  }

  if (errors.length === 2) {
    return NextResponse.json({ error: 'Both emails failed', details: errors }, { status: 500 });
  }

  return NextResponse.json({ ok: true, errors: errors.length ? errors : undefined });
}
