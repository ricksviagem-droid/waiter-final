import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';

import settingsRoutes from './routes/settings.routes';
import transactionsRoutes from './routes/transactions.routes';
import goalsRoutes from './routes/goals.routes';
import eventsRoutes from './routes/events.routes';
import aiRoutes from './routes/ai.routes';
import usersRoutes from './routes/users.routes';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(clerkMiddleware());

app.use('/api/users', usersRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/transactions', transactionsRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/ai', aiRoutes);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => console.log(`SafeSpend backend running on port ${PORT}`));
