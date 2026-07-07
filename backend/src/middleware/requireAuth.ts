import { Request, Response, NextFunction } from 'express';
import { getAuth } from '@clerk/express';
import { prisma } from '../lib/prisma';

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const { userId: clerkId } = getAuth(req);
  if (!clerkId) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const user = await prisma.user.findUnique({ where: { clerkId } });
  if (!user) {
    res.status(404).json({ error: 'User not found. Complete onboarding first.' });
    return;
  }
  (req as any).dbUser = user;
  next();
}
