import type { SafeStatus, SafeToSpendResult, FixedExpense } from '@/types'

export function calcularSafeToSpend(
  saldoAtual: number,
  diasAteProximoSalario: number,
  despesasFixasRestantes: number,
  bufferMinimo: number = 500
): number {
  const disponivelReal = saldoAtual - despesasFixasRestantes - bufferMinimo
  const porDia = disponivelReal / Math.max(diasAteProximoSalario, 1)
  return Math.max(0, porDia)
}

export function getStatus(safeToSpend: number, threshold: number): SafeStatus {
  if (safeToSpend > threshold * 1.5) return 'green'
  if (safeToSpend > threshold) return 'yellow'
  return 'red'
}

export function getDaysUntilSalary(salaryDay: number): number {
  const now = new Date()
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), salaryDay)
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, salaryDay)
  const target = thisMonth > now ? thisMonth : nextMonth
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export function getFixedExpensesRemaining(
  expenses: FixedExpense[],
  salaryDay: number
): number {
  const now = new Date()
  const today = now.getDate()
  return expenses
    .filter(e => !e.dueDay || e.dueDay >= today)
    .reduce((sum, e) => sum + e.amount, 0)
}

export function computeSafeToSpend(
  currentBalance: number,
  salaryDay: number,
  fixedExpenses: FixedExpense[],
  dangerZoneThreshold: number
): SafeToSpendResult {
  const daysUntilSalary = getDaysUntilSalary(salaryDay)
  const fixedExpensesRemaining = getFixedExpensesRemaining(fixedExpenses, salaryDay)
  const amount = calcularSafeToSpend(
    currentBalance,
    daysUntilSalary,
    fixedExpensesRemaining,
    dangerZoneThreshold
  )
  const status = getStatus(amount, dangerZoneThreshold / daysUntilSalary)
  return { amount, status, daysUntilSalary, currentBalance, fixedExpensesRemaining }
}

export function formatCurrency(value: number, currency = 'BRL'): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(date))
}
