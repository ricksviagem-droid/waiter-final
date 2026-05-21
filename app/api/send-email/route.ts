import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? '' });

const BREVO_KEY = process.env.BREVO_API_KEY ?? '';
const SENDER_EMAIL = 'Ricardo@brazilabroad.com';
const SENDER_NAME = 'Ricardo — Brazil Abroad';
const INTERNAL_EMAIL = 'Ricardo@brazilabroad.com';
const CALENDLY_URL = 'https://calendly.com/ricardo-rogerios/diagnostico-gratuito-_-brazil-abroad';

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

  // ── EMAIL INTERNO para Ricardo ─────────────────────────────────────────
  try {
    await sendEmail(
      INTERNAL_EMAIL,
      `🔔 Novo lead — ${name} (${profile.toUpperCase()}) | Brazil Abroad`,
      `<div style="font-family:Arial,sans-serif;max-width:600px;padding:24px;color:#1a1a1a">
        <h2 style="margin-bottom:16px">🔔 Novo lead — Brazil Abroad</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p><strong>Perfil:</strong> ${profile.toUpperCase()}</p>
        <hr style="margin:20px 0;border:none;border-top:1px solid #eee"/>
        <h3 style="margin-bottom:12px">Respostas do Assessment</h3>
        ${answersHtml || '<p>Sem respostas registradas.</p>'}
        <hr style="margin:20px 0;border:none;border-top:1px solid #eee"/>
        <a href="${CALENDLY_URL}" style="display:inline-block;background:#1A4A6B;color:white;padding:12px 24px;border-radius:50px;text-decoration:none;font-weight:700;font-size:14px">
          Ver disponibilidade no Calendly →
        </a>
      </div>`
    );
    console.log(`[send-email] Email interno enviado para ${INTERNAL_EMAIL}`);
  } catch (err) {
    errors.push(`email_interno: ${String(err)}`);
    console.error('[send-email] Falha no email interno:', err);
  }

  // ── Gera avaliação com OpenAI ──────────────────────────────────────────
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
          content: `Escreva uma avaliação encorajadora para ${name}, perfil: ${profile}. Respostas do assessment:\n${answersSummary}\n\nDestaque os pontos fortes e indique que o próximo passo é agendar o diagnóstico gratuito pelo Calendly.`,
        },
      ],
    });
    aiContent = resp.output_text ?? '';
  } catch (err) {
    console.error('[send-email] Erro OpenAI:', err);
    aiContent = `Analisamos seu perfil e ficamos muito animados com o que vimos!\n\nBrasileiros determinados chegam onde querem — e você já deu o primeiro passo fazendo o assessment.\n\nSeu próximo passo é agendar seu Diagnóstico Gratuito comigo. Em 30 minutos traçamos juntos o plano exato para você começar sua carreira internacional.`;
  }

  const aiParagraphs = aiContent
    .split('\n\n')
    .filter(Boolean)
    .map((p) => `<p style="color:#444;font-size:15px;line-height:1.75;margin-bottom:18px">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  // ── EMAIL para o usuário ───────────────────────────────────────────────
  try {
    await sendEmail(
      email,
      'Seu perfil foi analisado — agende seu diagnóstico gratuito',
      `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1a1a1a">

        <p style="color:#C9963A;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Brazil Abroad</p>
        <h1 style="font-size:26px;font-weight:700;margin:0 0 8px">Olá, ${name}!</h1>
        <p style="color:#777;font-size:14px;margin:0 0 28px">Seu assessment foi analisado. Aqui está o que vimos:</p>

        ${aiParagraphs}

        <!-- Botão Calendly -->
        <div style="background:#EBF2F8;border-radius:14px;padding:24px;margin:32px 0;text-align:center">
          <p style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#1A4A6B;margin:0 0 6px">Próximo passo</p>
          <p style="font-size:16px;font-weight:700;color:#1a1a1a;margin:0 0 20px">Agende seu Diagnóstico Gratuito — 30 minutos com Ricardo</p>
          <a href="${CALENDLY_URL}"
             style="display:inline-block;background:#C9963A;color:white;font-weight:700;padding:16px 36px;border-radius:50px;text-decoration:none;font-size:16px">
            Escolher meu horário →
          </a>
          <p style="font-size:12px;color:#999;margin:14px 0 0">Gratuito · Online · Em português · Horários disponíveis hoje</p>
        </div>

        <!-- Instruções antes da call -->
        <div style="background:#f9f9f9;border-radius:12px;padding:20px 24px;margin-bottom:28px">
          <p style="font-size:13px;font-weight:700;margin:0 0 12px;color:#1a1a1a">Antes de agendar, leia:</p>
          <ul style="margin:0;padding-left:20px;font-size:14px;color:#444;line-height:2">
            <li>A consulta é gratuita e conduzida em português</li>
            <li>Não é entrevista — é um diagnóstico personalizado</li>
            <li>Nunca cobramos por vagas em hipótese alguma</li>
            <li>Após agendar, você recebe o link do Zoom por e-mail</li>
            <li><strong>Esteja online 5 minutos antes do horário escolhido</strong></li>
          </ul>
        </div>

        <!-- Instruções do Zoom -->
        <div style="border:2px solid #E8E0D0;border-radius:12px;padding:20px 24px;margin-bottom:32px">
          <p style="font-size:13px;font-weight:700;margin:0 0 12px;color:#1a1a1a">Como usar o Zoom (caso seja seu primeiro acesso):</p>
          <ol style="margin:0;padding-left:20px;font-size:14px;color:#444;line-height:2.1">
            <li>Baixe o Zoom gratuitamente: <a href="https://zoom.us/download" style="color:#1A4A6B">zoom.us/download</a></li>
            <li>Instale no celular ou computador</li>
            <li>No dia da call, abra o e-mail de confirmação do Calendly</li>
            <li>Clique no link da reunião — o Zoom abrirá automaticamente</li>
            <li>Permita acesso à câmera e ao microfone quando solicitado</li>
            <li>Aguarde Ricardo entrar na sala — a reunião começa no horário marcado</li>
          </ol>
          <p style="font-size:12px;color:#999;margin:12px 0 0">Dúvidas? Me chame no WhatsApp: <a href="https://wa.me/5511962794747" style="color:#1A4A6B">+55 11 96279-4747</a></p>
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
