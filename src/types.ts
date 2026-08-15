export interface NavItem {
  label: string
  icon: string
  path: string
}

export interface Expense {
  id: string
  description: string
  categoryId: string
  categoryLabel: string
  date: string
  amount: number
  icon: string
  accentColor: 'warning' | 'negative' | 'neutral'
}

export type FixedExpenseStatus = 'paid' | 'unpaid'

export interface FixedExpense {
  id: string
  description: string
  tags: string[]
  amount: number
  status: FixedExpenseStatus
  dueDate: string
  icon: string
  urgent?: boolean
}

export interface CategoryBreakdownItem {
  categoryId: string
  label: string
  percent: number
  amount: number
  color: string
}

export interface SummaryStat {
  label: string
  sublabel: string
  value: string
  icon: string
  emphasis?: 'default' | 'accent' | 'positive'
}
