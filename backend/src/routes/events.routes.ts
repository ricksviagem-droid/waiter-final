import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const events = await prisma.event.findMany({ where: { userId: user.id }, orderBy: { date: 'asc' } });
  res.json(events);
});

router.post('/', requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const event = await prisma.event.create({ data: { userId: user.id, ...req.body } });
  res.json(event);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const e = await prisma.event.findFirst({ where: { id: req.params.id, userId: user.id } });
  if (!e) { res.status(404).json({ error: 'Not found' }); return; }
  await prisma.event.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;
