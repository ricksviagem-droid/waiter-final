export interface Settings {
  id: string
  userId: string
  currencyMain: string
  currenciesSecondary: string[]
  salaryAmount: number
  salaryDay: number
  loanBalance: number
  loanMonthlyPayment: number
  dangerZoneThreshold: number
  initialBalance: number
  currentBalance: number
  fixedExpenses: FixedExpense[]
  isMuted: boolean
  createdAt: string
  updatedAt: string
}

export interface FixedExpense {
  id: string
  label: string
  amount: number
  dueDay?: number
}

export interface Transaction {
  id: string
  userId: string
  date: string
  amount: number
  type: 'debit' | 'credit'
  category: string
  merchant?: string
  note?: string
  source: string
  rawSms?: string
  createdAt: string
}

export interface Goal {
  id: string
  userId: string
  title: string
  targetAmount: number
  targetDate: string
  currentAmount: number
  createdAt: string
  updatedAt: string
}

export interface Event {
  id: string
  userId: string
  title: string
  date: string
  type: 'vacation' | 'bonus' | 'contract_end' | 'other'
  amountImpact?: number
  createdAt: string
}

export type SafeStatus = 'green' | 'yellow' | 'red'

export interface SafeToSpendResult {
  amount: number
  status: SafeStatus
  daysUntilSalary: number
  currentBalance: number
  fixedExpensesRemaining: number
}

export interface FinancialScore {
  score: number
  status: 'ótimo' | 'bom' | 'atenção' | 'crítico'
  insights: string[]
  sugestao: string
}

export const CATEGORIES = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Compras',
  'Serviços',
  'Transferência',
  'Salário',
  'Outros',
] as const

export type Category = typeof CATEGORIES[number]

export const CATEGORY_ICONS: Record<string, string> = {
  Alimentação: '🍽️',
  Transporte: '🚌',
  Moradia: '🏠',
  Saúde: '💊',
  Educação: '📚',
  Lazer: '🎮',
  Compras: '🛒',
  Serviços: '⚙️',
  Transferência: '↔️',
  Salário: '💼',
  Outros: '📦',
}
