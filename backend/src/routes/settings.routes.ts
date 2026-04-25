import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const settings = await prisma.settings.findUnique({ where: { userId: user.id } });
  res.json(settings);
});

router.post('/', requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const data = req.body;
  try {
    const settings = await prisma.settings.upsert({
      where: { userId: user.id },
      update: data,
      create: { userId: user.id, ...data },
    });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

router.patch('/', requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  try {
    const settings = await prisma.settings.update({
      where: { userId: user.id },
      data: req.body,
    });
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
