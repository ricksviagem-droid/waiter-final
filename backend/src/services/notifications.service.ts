import webpush from 'web-push'
import { prisma } from '../lib/prisma'

webpush.setVapidDetails(
  'mailto:app@safespend.com',
  process.env.VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

function calcSafeToSpend(
  currentBalance: number,
  daysUntilSalary: number,
  fixedExpenses: number,
  buffer: number
): number {
  const available = currentBalance - fixedExpenses - buffer
  return Math.max(0, available / Math.max(daysUntilSalary, 1))
}

function getStatus(amount: number, threshold: number): 'green' | 'yellow' | 'red' {
  if (amount > threshold * 1.5) return 'green'
  if (amount > threshold) return 'yellow'
  return 'red'
}

function getDaysUntilSalary(salaryDay: number): number {
  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), salaryDay)
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, salaryDay)
  const target = thisMonth > now ? thisMonth : nextMonth
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export async function sendDailyNotifications() {
  const subscriptions = await prisma.pushSubscription.findMany({
    include: { user: { include: { settings: true } } },
  })

  for (const sub of subscriptions) {
    const settings = sub.user.settings
    if (!settings) continue

    const daysUntilSalary = getDaysUntilSalary(settings.salaryDay)
    const fixedTotal = Array.isArray(settings.fixedExpenses)
      ? (settings.fixedExpenses as any[]).reduce((s: number, e: any) => s + (e.amount || 0), 0)
      : 0

    const amount = calcSafeToSpend(
      settings.currentBalance,
      daysUntilSalary,
      fixedTotal,
      settings.dangerZoneThreshold
    )
    const status = getStatus(amount, settings.dangerZoneThreshold / daysUntilSalary)
    const emoji = status === 'green' ? '🟢' : status === 'yellow' ? '🟡' : '🔴'
    const formatted = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: settings.currencyMain }).format(amount)

    const payload = JSON.stringify({
      title: `SafeSpend — ${emoji} ${formatted}/dia`,
      body: status === 'red'
        ? `⚠️ Zona de perigo! ${daysUntilSalary} dias até o salário.`
        : `Você pode gastar até ${formatted} hoje com segurança.`,
      icon: '/favicon.svg',
      badge: '/badge.png',
      url: '/',
    })

    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      )
    } catch (err: any) {
      if (err.statusCode === 410) {
        await prisma.pushSubscription.delete({ where: { id: sub.id } })
      }
    }
  }
}
