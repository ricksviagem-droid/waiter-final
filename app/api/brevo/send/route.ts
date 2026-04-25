import { NextResponse } from 'next/server';

const profileContent = {
  ready: {
    label: 'READY',
    nextStep: 'Agendar uma consultoria personalizada',
  },
  almost: {
    label: 'ALMOST THERE',
    nextStep: 'Experimentar o simulador de conversas grátis',
  },
  builder: {
    label: 'BUILDER',
    nextStep: 'Começar com o eBook gratuito',
  },
};

export async function POST(req: Request) {
  const { name, email, profile } = await req.json();

  if (!name || !email || !profile) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Brevo not configured' }, { status: 500 });
  }

  const content = profileContent[profile as keyof typeof profileContent] ?? profileContent.builder;

  const emailBody = {
    sender: { name: 'Ricardo — Brazil Abroad', email: 'ricardo@brazilabroad.com' },
    to: [{ email, name }],
    subject: 'Seu road map Brazil Abroad está pronto 🌍',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; color: #1a1a1a;">
        <h1 style="font-size: 28px; font-weight: 700; margin-bottom: 8px;">Olá, ${name} 👋</h1>
        <p style="color: #777; font-size: 15px; margin-bottom: 32px;">Obrigado por fazer o assessment da Brazil Abroad.</p>

        <div style="background: #EBF2F8; border-left: 4px solid #1A4A6B; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
          <p style="font-size: 12px; text-transform: uppercase; letter-spacing: 2px; color: #777; margin-bottom: 8px;">Seu perfil</p>
          <h2 style="font-size: 22px; font-weight: 700; color: #1A4A6B; margin-bottom: 4px;">${content.label}</h2>
          <p style="font-size: 14px; color: #444; margin-top: 12px;">
            <strong>Próximo passo recomendado:</strong><br/>
            ${content.nextStep}
          </p>
        </div>

        <p style="font-size: 15px; color: #444; margin-bottom: 24px;">
          Criamos tudo que você precisa para chegar lá. Comece de graça agora:
        </p>

        <a href="https://brazilabroad.vercel.app" style="display: inline-block; background: #1A4A6B; color: white; font-weight: 600; padding: 14px 28px; border-radius: 50px; text-decoration: none; font-size: 15px;">
          Acessar Brazil Abroad →
        </a>

        <hr style="margin: 40px 0; border: none; border-top: 1px solid #eee;" />

        <p style="font-size: 13px; color: #777;">
          Qualquer dúvida — responde esse e-mail ou me chama no WhatsApp.<br/><br/>
          <strong>Ricardo</strong><br/>
          Fundador — Brazil Abroad
        </p>
      </div>
    `,
  };

  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailBody),
  });

  if (!res.ok) {
    const err = await res.text();
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
