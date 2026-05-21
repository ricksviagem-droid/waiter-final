import { NextResponse } from 'next/server';

const MP_ACCESS_TOKEN = process.env.MERCADO_PAGO_ACCESS_TOKEN ?? '';
const BASE_URL = 'https://www.brazilabroad.com';

const PACKAGES = {
  starter:   { title: '1 Aula de 45 min — Brazil Abroad',  price: 147, classes: 1 },
  pro:       { title: '2 Aulas de 45 min — Brazil Abroad', price: 247, classes: 2 },
  intensivo: { title: '4 Aulas de 45 min — Brazil Abroad', price: 299, classes: 4 },
} as const;

export async function POST(req: Request) {
  const { packageId } = await req.json() as { packageId: string };

  if (!MP_ACCESS_TOKEN) {
    return NextResponse.json(
      { error: 'MERCADO_PAGO_ACCESS_TOKEN não configurado' },
      { status: 500 }
    );
  }

  const pkg = PACKAGES[packageId as keyof typeof PACKAGES];
  if (!pkg) {
    return NextResponse.json({ error: 'Pacote inválido' }, { status: 400 });
  }

  try {
    const res = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ title: pkg.title, quantity: 1, unit_price: pkg.price, currency_id: 'BRL' }],
        back_urls: {
          success: `${BASE_URL}/pt/planos/sucesso`,
          failure: `${BASE_URL}/pt/planos/falha`,
          pending: `${BASE_URL}/pt/planos/pendente`,
        },
        auto_return: 'approved',
        notification_url: `${BASE_URL}/api/mp-webhook`,
        metadata: { package_id: packageId, classes: pkg.classes },
        statement_descriptor: 'BRAZIL ABROAD',
        payment_methods: { installments: 1 },
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(err);
    }

    const data = await res.json() as { init_point: string };
    return NextResponse.json({ init_point: data.init_point });
  } catch (err) {
    console.error('[mp-checkout] Erro:', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
