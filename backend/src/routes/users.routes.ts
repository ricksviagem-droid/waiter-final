import { Router } from 'express';
import { getAuth } from '@clerk/express';
import { prisma } from '../lib/prisma';

const router = Router();

router.post('/sync', async (req, res) => {
  const { userId: clerkId } = getAuth(req);
  if (!clerkId) { res.status(401).json({ error: 'Unauthorized' }); return; }

  const { email, name } = req.body;
  try {
    const user = await prisma.user.upsert({
      where: { clerkId },
      update: { email, name },
      create: { clerkId, email, name },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to sync user' });
  }
});

router.get('/me', async (req, res) => {
  const { userId: clerkId } = getAuth(req);
  if (!clerkId) { res.status(401).json({ error: 'Unauthorized' }); return; }
  const user = await prisma.user.findUnique({
    where: { clerkId },
    include: { settings: true },
  });
  res.json(user);
});

export default router;
