import { NextResponse } from 'next/server';

export async function GET() {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'BREVO_API_KEY não está configurado no Vercel — adicione a variável de ambiente' },
      { status: 500 }
    );
  }

  // Check verified senders
  let senders: unknown[] = [];
  try {
    const sendersRes = await fetch('https://api.brevo.com/v3/senders', {
      headers: { 'api-key': apiKey },
    });
    const sendersData = await sendersRes.json() as { senders?: unknown[] };
    senders = sendersData.senders ?? [];
  } catch {
    // ignore
  }

  // Try sending test email
  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'Brazil Abroad', email: 'Ricardo@brazilabroad.com' },
        to: [{ email: 'Ricardo@brazilabroad.com' }],
        subject: 'Teste — Brazil Abroad funcionando!',
        htmlContent: '<h1>Funcionou! 🎉</h1><p>O sistema de emails está operacional.</p>',
      }),
    });

    const data = await res.text();

    if (!res.ok) {
      return NextResponse.json(
        {
          error: 'Brevo rejeitou o email',
          status: res.status,
          detail: data,
          senders_verificados: senders,
          solucao: 'Acesse app.brevo.com → Senders & IP → Senders → verifique se ricardo.rogerios@hotmail.com está na lista',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: 'Email enviado com sucesso! Verifique o hotmail.',
      senders_verificados: senders,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err), senders_verificados: senders }, { status: 500 });
  }
}
