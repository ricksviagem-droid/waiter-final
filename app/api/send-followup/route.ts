import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY ?? '' });

const BREVO_KEY = process.env.BREVO_API_KEY ?? '';
const SENDER_EMAIL = 'Ricardo@brazilabroad.com';
const SENDER_NAME = 'Ricardo — Brazil Abroad';

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
  const { name, email, notes } = await req.json() as {
    name: string;
    email: string;
    notes?: string;
  };

  if (!name || !email) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  // ── Gera diagnóstico com OpenAI ────────────────────────────────────────────
  let aiDiagnosis = '';
  try {
    const resp = await openai.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'system',
          content: 'Você é Ricardo, fundador do Brazil Abroad. Escreva de forma calorosa, encorajadora e profissional. Português brasileiro. 2 parágrafos curtos. Não use saudação. Não inclua assinatura.',
        },
        {
          role: 'user',
          content: `Escreva um diagnóstico pós-call encorajador para ${name}. ${notes ? `Notas da conversa: ${notes}` : 'Destaque o potencial para uma carreira internacional em hospitalidade de luxo e a importância do próximo passo.'}`,
        },
      ],
    });
    aiDiagnosis = resp.output_text ?? '';
  } catch {
    aiDiagnosis = `Foi um prazer falar com você hoje, ${name}! Sua motivação e determinação ficaram muito claras durante nossa conversa.\n\nVocê tem exatamente o perfil que o mercado internacional busca. Com a preparação certa, sua jornada começa agora.`;
  }

  const aiParagraphs = aiDiagnosis
    .split('\n\n')
    .filter(Boolean)
    .map((p) => `<p style="color:#444;font-size:15px;line-height:1.75;margin-bottom:16px">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1a1a1a">

    <p style="color:#C9963A;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Brazil Abroad</p>
    <h1 style="font-size:26px;font-weight:700;margin:0 0 8px">Obrigado pela nossa conversa, ${name}!</h1>
    <p style="color:#777;font-size:14px;margin:0 0 28px">Foi incrível conhecer sua história e seus objetivos.</p>

    ${aiParagraphs}

    <hr style="margin:32px 0;border:none;border-top:1px solid #eee"/>

    <!-- Sobre o programa -->
    <h2 style="font-size:18px;font-weight:700;margin:0 0 16px">Sua jornada começa agora</h2>

    <p style="font-size:14px;color:#444;line-height:1.8;margin-bottom:12px">
      O programa Brazil Abroad é conduzido diretamente por mim — Ricardo — com 15 anos de experiência em hospitalidade internacional e atualmente Supervisor ativo no <strong>Atlantis The Royal, Dubai</strong>.
    </p>

    <ul style="font-size:14px;color:#444;line-height:2;padding-left:20px;margin-bottom:24px">
      <li>Aulas particulares de inglês para hospitalidade de luxo com Ricardo</li>
      <li>Parceiros oficiais da <strong>ÉS English School</strong> — maior referência de intercâmbio para Dubai e Londres</li>
      <li>Trabalhamos com agências recrutadoras internacionais</li>
      <li><strong>Fit for Duty</strong> — te deixamos pronto para o mercado internacional</li>
      <li>Nunca cobramos por vagas em hipótese alguma</li>
    </ul>

    <p style="font-size:13px;color:#777;margin-bottom:28px">
      Você pode ver os relatos de quem já passou pelo programa em:
      <a href="https://waiter-final.vercel.app/pt" style="color:#1A4A6B">waiter-final.vercel.app/pt</a>
    </p>

    <hr style="margin:32px 0;border:none;border-top:1px solid #eee"/>

    <!-- Pacotes -->
    <h2 style="font-size:18px;font-weight:700;margin:0 0 16px">Nossos pacotes</h2>

    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:8px">
      <tr style="background:#f5f5f5">
        <td style="padding:12px 16px;border-radius:8px 0 0 0;font-weight:700">1 aula de 45 min</td>
        <td style="padding:12px 16px;border-radius:0 8px 0 0;text-align:right;font-weight:700;color:#1A4A6B">R$ 147</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;border-top:1px solid #eee">2 aulas de 45 min</td>
        <td style="padding:12px 16px;border-top:1px solid #eee;text-align:right;font-weight:700;color:#1A4A6B">R$ 247</td>
      </tr>
      <tr style="background:#f5f5f5">
        <td style="padding:12px 16px">4 aulas de 45 min</td>
        <td style="padding:12px 16px;text-align:right;font-weight:700;color:#1A4A6B">R$ 299</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;border-top:1px solid #eee;font-style:italic;color:#777" colspan="2">Pacotes personalizados disponíveis — entre em contato</td>
      </tr>
    </table>

    <div style="background:#EBF2F8;border-radius:12px;padding:20px 24px;margin:24px 0">
      <p style="font-size:13px;font-weight:700;margin:0 0 10px;color:#1A4A6B">O que está incluído em todos os pacotes:</p>
      <ul style="margin:0;padding-left:20px;font-size:14px;color:#444;line-height:1.9">
        <li>Mentoria com Ricardo — 15 anos em hospitalidade de luxo</li>
        <li>Acesso vitalício a todos os aplicativos do site</li>
        <li>Curso gravado de inglês para hospitalidade hospedado na Hotmart — vitalício</li>
      </ul>
    </div>

    <hr style="margin:32px 0;border:none;border-top:1px solid #eee"/>

    <!-- Pagamento -->
    <h2 style="font-size:18px;font-weight:700;margin:0 0 16px">Como funciona o pagamento</h2>

    <ul style="font-size:14px;color:#444;line-height:2;padding-left:20px;margin-bottom:24px">
      <li>Pagamento via Pix: <strong>ricardo.rogerios@hotmail.com</strong></li>
      <li>Após confirmação do pagamento você recebe acesso ao Calendly para agendar suas aulas</li>
      <li>Reagendamento disponível com até 24h de antecedência</li>
    </ul>

    <div style="background:#FDF6EC;border:2px solid #C9963A;border-radius:12px;padding:20px 24px;margin-bottom:32px;text-align:center">
      <p style="font-size:13px;color:#777;margin:0 0 8px">Chave Pix</p>
      <p style="font-size:18px;font-weight:700;color:#C9963A;margin:0 0 4px;letter-spacing:0.5px">ricardo.rogerios@hotmail.com</p>
      <p style="font-size:12px;color:#999;margin:0">Copie a chave acima e pague pelo app do seu banco</p>
    </div>

    <a href="https://calendly.com/ricardo-rogerios/diagnostico-gratuito-_-brazil-abroad"
       style="display:block;background:#C9963A;color:white;font-weight:700;padding:16px 28px;border-radius:50px;text-decoration:none;font-size:15px;text-align:center;margin-bottom:32px">
      Quero começar — Pagar via Pix →
    </a>

    <hr style="margin:32px 0;border:none;border-top:1px solid #eee"/>
    <p style="font-size:13px;color:#777">Ricardo Rogerio — Brazil Abroad | Fit for Duty | @brazilabroad_</p>

  </div>`;

  try {
    await sendEmail(email, 'Obrigado pela nossa conversa — Brazil Abroad', html);
    console.log(`[send-followup] Email enviado para ${email}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[send-followup] Falha:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
