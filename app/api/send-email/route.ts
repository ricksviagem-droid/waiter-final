import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? '' });

const BREVO_KEY = process.env.BREVO_API_KEY ?? '';
const SENDER_EMAIL = 'ricardo.rogerios@hotmail.com';
const SENDER_NAME = 'Ricardo — Brazil Abroad';
const INTERNAL_EMAIL = 'ricardo.rogerios@hotmail.com';

interface AnswerItem {
  question: string;
  answer: string;
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': BREVO_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Brevo error: ${err}`);
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

  const answersHtml = answersText
    ?.map((a) => `<p style="margin:6px 0"><strong>${a.question}</strong><br/>${a.answer}</p>`)
    .join('') ?? '';

  const answersSummary = answersText
    ?.map((a) => `${a.question}: ${a.answer}`)
    .join('\n') ?? '';

  const errors: string[] = [];

  // ── EMAIL INTERNO ──────────────────────────────────────────────────────────
  try {
    await sendEmail(
      INTERNAL_EMAIL,
      `Novo lead — ${name} | Brazil Abroad`,
      `<div style="font-family:Arial,sans-serif;max-width:600px;padding:24px;color:#1a1a1a">
        <h2 style="margin-bottom:16px">Novo lead — Brazil Abroad</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Perfil:</strong> ${profile.toUpperCase()}</p>
        <hr style="margin:20px 0;border:none;border-top:1px solid #eee"/>
        <h3>Respostas do Assessment</h3>
        ${answersHtml || '<p>Sem respostas registradas.</p>'}
      </div>`
    );
    console.log(`[send-email] Email interno enviado para ${INTERNAL_EMAIL}`);
  } catch (err) {
    errors.push(`email_interno: ${String(err)}`);
    console.error('[send-email] Falha no email interno:', err);
  }

  // ── Gera avaliação com OpenAI ──────────────────────────────────────────────
  let aiContent = '';
  try {
    const resp = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: 'Você é Ricardo, fundador do Brazil Abroad. Escreva de forma pessoal, encorajadora e profissional. Português brasileiro. Máximo 3 parágrafos curtos. Não use saudação no início. Não inclua assinatura.',
        },
        {
          role: 'user',
          content: `Escreva uma avaliação encorajadora para ${name}, perfil: ${profile}. Respostas do assessment:\n${answersSummary}\n\nDestaque os pontos fortes e indique que o próximo passo é agendar o diagnóstico gratuito.`,
        },
      ],
    });
    aiContent = resp.output_text ?? '';
  } catch (err) {
    console.error('[send-email] Erro OpenAI:', err);
    aiContent = `Analisamos seu perfil e ficamos muito animados com o que vimos!\n\nBrasileiros determinados chegam onde querem — e você já deu o primeiro passo fazendo o assessment.\n\nSeu próximo passo é agendar seu Diagnóstico Gratuito. Em 30 minutos traçamos juntos o plano exato para você começar sua carreira internacional.`;
  }

  const aiParagraphs = aiContent
    .split('\n\n')
    .filter(Boolean)
    .map((p) => `<p style="color:#444;font-size:15px;line-height:1.75;margin-bottom:16px">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  // ── EMAIL PARA O USUÁRIO ───────────────────────────────────────────────────
  try {
    await sendEmail(
      email,
      'Seu perfil foi analisado — Brazil Abroad',
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1a1a1a">

        <p style="color:#C9963A;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Brazil Abroad</p>
        <h1 style="font-size:26px;font-weight:700;margin:0 0 24px">Olá, ${name} 👋</h1>

        ${aiParagraphs}

        <div style="margin:32px 0">
          <p style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#777;margin-bottom:12px">Próximo passo</p>
          <a href="https://calendly.com/ricardo-rogerios/diagnostico-gratuito-_-brazil-abroad"
             style="display:block;background:#C9963A;color:white;font-weight:700;padding:16px 28px;border-radius:50px;text-decoration:none;font-size:15px;text-align:center">
            Agendar meu diagnóstico gratuito →
          </a>
        </div>

        <div style="background:#f9f9f9;border-radius:12px;padding:20px 24px;margin-bottom:32px">
          <p style="font-size:13px;font-weight:700;margin:0 0 12px;color:#1a1a1a">Antes de agendar, saiba:</p>
          <ul style="margin:0;padding-left:20px;font-size:14px;color:#444;line-height:1.9">
            <li>A consulta é 100% gratuita e conduzida em português (pode ser em inglês se preferir)</li>
            <li>Não é uma entrevista — é um programa de capacitação</li>
            <li>Não cobramos por vagas em hipótese alguma</li>
            <li>Instale o Zoom ou Google Meet no seu dispositivo antes da call</li>
            <li>Esteja online 5 minutos antes do horário agendado</li>
            <li>O link da videochamada será enviado por email após o agendamento</li>
          </ul>
        </div>

        <hr style="margin:32px 0;border:none;border-top:1px solid #eee"/>
        <p style="font-size:13px;color:#777">Ricardo Rogerio — Brazil Abroad | Fit for Duty | Supervisor ativo no Atlantis The Royal, Dubai</p>

      </div>`
    );
    console.log(`[send-email] Email enviado para ${email}`);
  } catch (err) {
    errors.push(`email_usuario: ${String(err)}`);
    console.error('[send-email] Falha no email do usuário:', err);
  }

  if (errors.length === 2) {
    return NextResponse.json({ error: 'Both emails failed', details: errors }, { status: 500 });
  }

  return NextResponse.json({ ok: true, errors: errors.length ? errors : undefined });
}
