import { Router } from 'express';
import { requireAuth } from '../middleware/requireAuth';
import { prisma } from '../lib/prisma';
import { parseSmsWithAI, getFinancialScore, chatWithAI } from '../services/openai.service';

const router = Router();

router.post('/sms', requireAuth, async (req, res) => {
  const { smsText } = req.body;
  if (!smsText) { res.status(400).json({ error: 'smsText required' }); return; }
  try {
    const result = await parseSmsWithAI(smsText);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: 'AI parsing failed' });
  }
});

router.get('/score', requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  try {
    const settings = await prisma.settings.findUnique({ where: { userId: user.id } });
    if (!settings) { res.status(404).json({ error: 'Settings not found' }); return; }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id, date: { gte: startOfMonth } },
    });

    const monthlyExpenses = transactions
      .filter(t => t.type === 'debit')
      .reduce((sum, t) => sum + t.amount, 0);

    const categoryMap: Record<string, number> = {};
    transactions.filter(t => t.type === 'debit').forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
    });
    const topCategories = Object.entries(categoryMap)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const savingsRate = settings.salaryAmount > 0
      ? Math.max(0, (settings.salaryAmount - monthlyExpenses) / settings.salaryAmount * 100)
      : 0;

    const nextSalaryDate = new Date(now.getFullYear(), now.getMonth(), settings.salaryDay);
    if (nextSalaryDate <= now) nextSalaryDate.setMonth(nextSalaryDate.getMonth() + 1);
    const daysUntilSalary = Math.ceil((nextSalaryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    const fixedExpenses = Array.isArray(settings.fixedExpenses)
      ? (settings.fixedExpenses as any[]).reduce((s: number, e: any) => s + (e.amount || 0), 0)
      : 0;
    const safeToSpend = Math.max(
      0,
      (settings.currentBalance - fixedExpenses - settings.dangerZoneThreshold) / Math.max(daysUntilSalary, 1)
    );

    const score = await getFinancialScore({
      safeToSpend,
      currentBalance: settings.currentBalance,
      monthlyExpenses,
      salaryAmount: settings.salaryAmount,
      loanBalance: settings.loanBalance,
      savingsRate,
      topCategories,
    });

    res.json(score);
  } catch (err) {
    res.status(500).json({ error: 'Score calculation failed' });
  }
});

router.post('/chat', requireAuth, async (req, res) => {
  const user = (req as any).dbUser;
  const { message } = req.body;
  if (!message) { res.status(400).json({ error: 'message required' }); return; }

  try {
    const settings = await prisma.settings.findUnique({ where: { userId: user.id } });
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const transactions = await prisma.transaction.findMany({
      where: { userId: user.id, date: { gte: startOfMonth } },
      orderBy: { date: 'desc' },
      take: 20,
    });

    const context = {
      currentBalance: settings?.currentBalance,
      salaryAmount: settings?.salaryAmount,
      salaryDay: settings?.salaryDay,
      loanBalance: settings?.loanBalance,
      dangerZoneThreshold: settings?.dangerZoneThreshold,
      recentTransactions: transactions.slice(0, 10).map(t => ({
        date: t.date, amount: t.amount, type: t.type, category: t.category, merchant: t.merchant,
      })),
    };

    const reply = await chatWithAI(message, context);
    res.json({ reply });
  } catch (err) {
    res.status(500).json({ error: 'Chat failed' });
  }
});

export default router;
