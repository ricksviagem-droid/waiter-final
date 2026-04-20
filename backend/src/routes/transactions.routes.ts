import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { prisma } from '../lib/prisma';

const router = Router();

router.get('/', requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const { month, year, category, type } = req.query;

  const where: any = { userId: user.id };
  if (month && year) {
    const start = new Date(Number(year), Number(month) - 1, 1);
    const end = new Date(Number(year), Number(month), 0, 23, 59, 59);
    where.date = { gte: start, lte: end };
  }
  if (category) where.category = category;
  if (type) where.type = type;

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { date: 'desc' },
  });
  res.json(transactions);
});

router.post('/', requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  try {
    const tx = await prisma.transaction.create({
      data: { userId: user.id, ...req.body },
    });
    // Update current balance
    const delta = tx.type === 'credit' ? tx.amount : -tx.amount;
    await prisma.settings.update({
      where: { userId: user.id },
      data: { currentBalance: { increment: delta } },
    });
    res.json(tx);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

router.patch('/:id', requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const tx = await prisma.transaction.findFirst({ where: { id: req.params.id, userId: user.id } });
  if (!tx) { res.status(404).json({ error: 'Not found' }); return; }
  const updated = await prisma.transaction.update({ where: { id: req.params.id }, data: req.body });
  res.json(updated);
});

router.delete('/:id', requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const tx = await prisma.transaction.findFirst({ where: { id: req.params.id, userId: user.id } });
  if (!tx) { res.status(404).json({ error: 'Not found' }); return; }
  await prisma.transaction.delete({ where: { id: req.params.id } });
  const delta = tx.type === 'credit' ? -tx.amount : tx.amount;
  await prisma.settings.update({
    where: { userId: user.id },
    data: { currentBalance: { increment: delta } },
  });
  res.json({ ok: true });
});

export default router;
