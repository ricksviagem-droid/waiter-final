import Stripe from 'stripe'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')

  if (!sessionId) {
    return Response.json({ paid: false }, { status: 400 })
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY
  if (!stripeKey) {
    return Response.json({ paid: false }, { status: 503 })
  }

  const stripe = new Stripe(stripeKey)

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return Response.json({ paid: session.payment_status === 'paid' })
  } catch (error) {
    console.error('Stripe verify error:', error)
    return Response.json({ paid: false }, { status: 500 })
  }
}
