import Stripe from 'stripe'

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return Response.json({ error: 'Pagamento não configurado.' }, { status: 503 })
  }

  const stripe = new Stripe(stripeKey)
  const origin = req.headers.get('origin') || 'http://localhost:3000'

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Relatório Veredito — Análise Completa de Viabilidade',
              description:
                'Cenários financeiros detalhados, 3 maiores riscos, recomendação final e dados de fontes reais (SEBRAE, ABRASEL, IBGE).',
            },
            unit_amount: 9700,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/veredito?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/veredito?payment=cancel`,
    })

    return Response.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return Response.json({ error: 'Erro ao criar sessão de pagamento.' }, { status: 500 })
  }
}
