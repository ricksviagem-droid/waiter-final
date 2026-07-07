import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const goals = await prisma.goal.findMany({ where: { userId: user.id }, orderBy: { targetDate: 'asc' } });
  res.json(goals);
});

router.post('/', requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const goal = await prisma.goal.create({ data: { userId: user.id, ...req.body } });
  res.json(goal);
});

router.patch('/:id', requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const g = await prisma.goal.findFirst({ where: { id: req.params.id, userId: user.id } });
  if (!g) { res.status(404).json({ error: 'Not found' }); return; }
  const updated = await prisma.goal.update({ where: { id: req.params.id }, data: req.body });
  res.json(updated);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const g = await prisma.goal.findFirst({ where: { id: req.params.id, userId: user.id } });
  if (!g) { res.status(404).json({ error: 'Not found' }); return; }
  await prisma.goal.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

export default router;
