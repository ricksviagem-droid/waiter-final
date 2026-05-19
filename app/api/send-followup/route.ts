import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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
  const { name, email } = await req.json() as { name: string; email: string };

  if (!name || !email) {
    return NextResponse.json({ error: 'Missing name or email' }, { status: 400 });
  }

  if (!process.env.BREVO_API_KEY) {
    return NextResponse.json({ error: 'Email not configured' }, { status: 500 });
  }

  const transport = createTransport();

  try {
    await transport.sendMail({
      from: '"Ricardo — Brazil Abroad" <ricardo@brazilabroad.com>',
      to: email,
      subject: 'Obrigado pela nossa conversa — Brazil Abroad',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:32px 24px;color:#1a1a1a">
          <p style="color:#C9963A;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px">Brazil Abroad</p>
          <h1 style="font-size:26px;font-weight:700;margin:0 0 20px">Obrigado pela nossa conversa, ${name}!</h1>

          <p style="font-size:15px;line-height:1.75;color:#444;margin-bottom:16px">
            Foi um prazer conversar com você! Sua determinação e disposição para dar esse passo são exatamente o que separa quem sonha de quem realiza.
          </p>
          <p style="font-size:15px;line-height:1.75;color:#444;margin-bottom:28px">
            Como combinamos, aqui estão os nossos pacotes para você começar sua jornada internacional:
          </p>

          <!-- Pacotes -->
          <div style="background:#f8f5ef;border-radius:12px;padding:24px;margin-bottom:28px">
            <h2 style="font-size:18px;color:#1A4A6B;margin:0 0 20px">Pacotes Brazil Abroad</h2>

            <div style="border:1px solid #e0d8cc;border-radius:8px;background:#fff;padding:16px 20px;margin-bottom:12px">
              <p style="margin:0 0 4px;font-weight:700;font-size:15px;color:#1a1a1a">Aula avulsa · 45 min</p>
              <p style="margin:0;font-size:22px;font-weight:800;color:#C9963A">R$ 147</p>
            </div>

            <div style="border:2px solid #1A4A6B;border-radius:8px;background:#fff;padding:16px 20px;margin-bottom:12px;position:relative">
              <span style="position:absolute;top:-10px;right:16px;background:#1A4A6B;color:#fff;font-size:10px;font-weight:700;letter-spacing:1px;padding:3px 10px;border-radius:99px;text-transform:uppercase">Popular</span>
              <p style="margin:0 0 4px;font-weight:700;font-size:15px;color:#1a1a1a">2 aulas / semana</p>
              <p style="margin:0;font-size:22px;font-weight:800;color:#C9963A">R$ 247 <span style="font-size:14px;font-weight:400;color:#777">/mês</span></p>
            </div>

            <div style="border:1px solid #e0d8cc;border-radius:8px;background:#fff;padding:16px 20px;margin-bottom:20px">
              <p style="margin:0 0 4px;font-weight:700;font-size:15px;color:#1a1a1a">3 aulas / semana</p>
              <p style="margin:0;font-size:22px;font-weight:800;color:#C9963A">R$ 300 <span style="font-size:14px;font-weight:400;color:#777">/mês</span></p>
            </div>

            <div style="background:#e8f0e8;border-radius:8px;padding:12px 16px">
              <p style="margin:0;font-size:13px;color:#2d6a4f;font-weight:600">🎁 Todos os pacotes incluem: curso gravado completo na Hotmart</p>
            </div>
          </div>

          <!-- Pagamento -->
          <div style="background:#fff8ee;border:1px solid #f0ddb0;border-radius:12px;padding:20px 24px;margin-bottom:28px">
            <h3 style="font-size:15px;color:#1a1a1a;margin:0 0 12px">Como pagar</h3>
            <p style="font-size:14px;color:#555;margin:0 0 8px">
              <strong>Chave Pix:</strong> <span style="font-family:monospace;background:#fff;padding:2px 8px;border-radius:4px;border:1px solid #e0d8cc">ricardo.rogerios@hotmail.com</span>
            </p>
            <p style="font-size:14px;color:#555;margin:0">
              Após o pagamento, envie o comprovante para <strong>ricardo@brazilabroad.com</strong> para liberar o agendamento das suas aulas.
            </p>
          </div>

          <!-- CTA -->
          <div style="margin-bottom:32px;text-align:center">
            <a href="https://calendly.com/ricardo-rogerios/30min"
               style="display:inline-block;background:#1A4A6B;color:white;font-weight:700;padding:16px 36px;border-radius:50px;text-decoration:none;font-size:15px">
              Agendar Minhas Aulas →
            </a>
          </div>

          <hr style="margin:32px 0;border:none;border-top:1px solid #eee"/>
          <p style="font-size:13px;color:#777">Ricardo — Brazil Abroad | Fit for Duty</p>
        </div>
      `,
    });

    console.log(`[send-followup] Email enviado para ${email}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[send-followup] Falha:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
