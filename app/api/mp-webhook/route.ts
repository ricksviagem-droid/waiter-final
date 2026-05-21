import { NextResponse } from 'next/server';

const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN ?? '';
const BREVO_KEY = process.env.BREVO_API_KEY ?? '';
const SENDER_EMAIL = 'Ricardo@brazilabroad.com';
const SENDER_NAME = 'Ricardo — Brazil Abroad';
const CALENDLY_URL = 'https://calendly.com/ricardo-rogerios/diagnostico-gratuito-_-brazil-abroad';

const PACKAGE_NAMES: Record<string, string> = {
  starter:   '1 aula de 45 minutos',
  pro:       '2 aulas de 45 minutos',
  intensivo: '4 aulas de 45 minutos',
};

async function getPayment(paymentId: string) {
  const res = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
  });
  if (!res.ok) throw new Error(`MP ${res.status}: ${await res.text()}`);
  return res.json() as Promise<{
    status: string;
    payer?: { email?: string; first_name?: string; last_name?: string };
    metadata?: { package_id?: string };
  }>;
}

async function sendConfirmationEmail(email: string, name: string, packageId: string) {
  const packageName = PACKAGE_NAMES[packageId] ?? 'suas aulas';
  const firstName = name?.split(' ')[0] || 'você';

  const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1a1a1a">

    <p style="color:#C9963A;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Brazil Abroad</p>
    <h1 style="font-size:26px;font-weight:700;margin:0 0 8px">Pagamento confirmado!</h1>
    <p style="color:#777;font-size:14px;margin:0 0 28px">Olá, ${firstName}! Seu acesso está garantido.</p>

    <div style="background:#EDF5F0;border-radius:12px;padding:20px 24px;margin-bottom:28px">
      <p style="font-size:13px;color:#2d6a4f;font-weight:700;margin:0 0 6px">✓ Compra confirmada</p>
      <p style="font-size:15px;font-weight:700;color:#1a1a1a;margin:0">${packageName} com Ricardo</p>
    </div>

    <p style="font-size:15px;color:#444;line-height:1.75;margin-bottom:24px">
      Clique no botão abaixo para agendar sua aula. Escolha o dia e horário que preferir — o link do Zoom será enviado automaticamente para o seu e-mail após o agendamento.
    </p>

    <a href="${CALENDLY_URL}"
       style="display:block;background:#C9963A;color:white;font-weight:700;padding:16px 28px;border-radius:50px;text-decoration:none;font-size:15px;text-align:center;margin-bottom:32px">
      Agendar minha aula →
    </a>

    <div style="background:#f9f9f9;border-radius:12px;padding:20px 24px;margin-bottom:28px">
      <p style="font-size:13px;font-weight:700;margin:0 0 10px;color:#1a1a1a">Antes de agendar, lembre-se:</p>
      <ul style="margin:0;padding-left:20px;font-size:14px;color:#444;line-height:1.9">
        <li>A aula é conduzida em português (pode ser em inglês se preferir)</li>
        <li>Instale o Zoom no seu dispositivo antes da aula</li>
        <li>Esteja online 5 minutos antes do horário agendado</li>
        <li>O link da videochamada será enviado por e-mail após o agendamento</li>
        <li>Reagendamento disponível com até 24h de antecedência</li>
      </ul>
    </div>

    <hr style="margin:32px 0;border:none;border-top:1px solid #eee"/>

    <p style="font-size:14px;color:#444;margin-bottom:8px">
      Qualquer dúvida, fale comigo pelo WhatsApp:
    </p>
    <a href="https://wa.me/5511962794747" style="color:#1A4A6B;font-size:14px">+55 11 96279-4747</a>

    <hr style="margin:32px 0;border:none;border-top:1px solid #eee"/>
    <p style="font-size:13px;color:#777">Ricardo Rogerio — Brazil Abroad | Fit for Duty | Supervisor ativo no Atlantis The Royal, Dubai</p>

  </div>`;

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': BREVO_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sender: { name: SENDER_NAME, email: SENDER_EMAIL },
      to: [{ email }],
      subject: 'Pagamento confirmado — Agende sua aula! — Brazil Abroad',
      htmlContent: html,
    }),
  });

  if (!res.ok) throw new Error(`Brevo: ${await res.text()}`);
}

async function processPayment(paymentId: string) {
  const payment = await getPayment(paymentId);
  if (payment.status !== 'approved') return;

  const email = payment.payer?.email;
  const name = `${payment.payer?.first_name ?? ''} ${payment.payer?.last_name ?? ''}`.trim();
  const packageId = payment.metadata?.package_id ?? '';

  if (email) {
    await sendConfirmationEmail(email, name, packageId);
    console.log(`[mp-webhook] Email enviado para ${email} (payment ${paymentId})`);
  }
}

export async function POST(req: Request) {
  const url = new URL(req.url);
  let paymentId: string | undefined;

  try {
    const body = await req.json() as Record<string, unknown>;

    if (body?.type === 'payment') {
      paymentId = String((body.data as Record<string, unknown>)?.id ?? '');
    } else if (body?.topic === 'payment') {
      paymentId = String(body.id ?? '');
    }
  } catch {
    // body might not be JSON (IPN uses query params)
  }

  if (!paymentId) {
    const topicParam = url.searchParams.get('topic');
    const idParam = url.searchParams.get('id');
    if (topicParam === 'payment' && idParam) paymentId = idParam;
  }

  if (paymentId && paymentId !== 'undefined') {
    try {
      await processPayment(paymentId);
    } catch (err) {
      console.error('[mp-webhook] Erro:', err);
    }
  }

  return NextResponse.json({ ok: true });
}

// IPN can also be a GET
export async function GET(req: Request) {
  const url = new URL(req.url);
  const topic = url.searchParams.get('topic');
  const id = url.searchParams.get('id');

  if (topic === 'payment' && id) {
    try {
      await processPayment(id);
    } catch (err) {
      console.error('[mp-webhook] GET erro:', err);
    }
  }

  return NextResponse.json({ ok: true });
}
