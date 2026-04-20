import { Router } from 'express'
import { getAuth } from '@clerk/express'
import { prisma } from '../lib/prisma'

const router = Router()

router.post('/subscribe', async (req, res) => {
  const { userId: clerkId } = getAuth(req)
  if (!clerkId) { res.status(401).json({ error: 'Unauthorized' }); return }

  const user = await prisma.user.findUnique({ where: { clerkId } })
  if (!user) { res.status(404).json({ error: 'User not found' }); return }

  const { endpoint, keys } = req.body
  if (!endpoint || !keys?.p256dh || !keys?.auth) {
    res.status(400).json({ error: 'Invalid subscription' }); return
  }

  await prisma.pushSubscription.upsert({
    where: { endpoint },
    update: { p256dh: keys.p256dh, auth: keys.auth, userId: user.id },
    create: { endpoint, p256dh: keys.p256dh, auth: keys.auth, userId: user.id },
  })

  res.json({ ok: true })
})

router.delete('/unsubscribe', async (req, res) => {
  const { userId: clerkId } = getAuth(req)
  if (!clerkId) { res.status(401).json({ error: 'Unauthorized' }); return }

  const { endpoint } = req.body
  await prisma.pushSubscription.deleteMany({ where: { endpoint } })
  res.json({ ok: true })
})

export default router
