import type {
  Category,
  CategoryBreakdownItem,
  Expense,
  FixedExpense,
  NavItem,
} from './types'

export const navItems: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { label: 'Expenses Log', icon: 'receipt_long', path: '/expenses' },
  { label: 'Fixed Expenses', icon: 'calendar_today', path: '/fixed-expenses' },
  { label: 'Categories', icon: 'category', path: '/categories' },
]

export const categories: Category[] = [
  { id: 'lanche', name: 'lanche', icon: 'fastfood' },
  { id: 'mercado', name: 'mercado', icon: 'shopping_cart' },
  { id: 'uber', name: 'uber', icon: 'directions_car' },
  { id: 'farmacia', name: 'farmacia', icon: 'medication' },
  { id: 'aluguel', name: 'aluguel', icon: 'home' },
  { id: 'energia', name: 'energia', icon: 'bolt' },
  { id: 'agua', name: 'agua', icon: 'water_drop' },
  { id: 'internet', name: 'internet', icon: 'wifi' },
  { id: 'celular', name: 'celular', icon: 'phone_iphone' },
  { id: 'assinaturas', name: 'assinaturas', icon: 'movie' },
]

export const recentExpenses: Expense[] = [
  {
    id: 'exp-1',
    description: 'Lanche Padaria',
    categoryId: 'lanche',
    categoryLabel: 'lanche',
    date: 'Today, 08:30 AM',
    amount: 12.5,
    icon: 'restaurant',
    accentColor: 'warning',
  },
  {
    id: 'exp-2',
    description: 'Supermercado Dia',
    categoryId: 'mercado',
    categoryLabel: 'mercado',
    date: 'Yesterday',
    amount: 145.2,
    icon: 'shopping_cart',
    accentColor: 'negative',
  },
  {
    id: 'exp-3',
    description: 'Uber Ride',
    categoryId: 'uber',
    categoryLabel: 'transport',
    date: 'Oct 24',
    amount: 18.0,
    icon: 'directions_car',
    accentColor: 'neutral',
  },
]

export const dailyExpenses: Expense[] = [
  {
    id: 'day-1',
    description: 'Padaria Pão Quente',
    categoryId: 'lanche',
    categoryLabel: 'lanche',
    date: 'Oct 24, 2023',
    amount: 12.5,
    icon: 'restaurant',
    accentColor: 'warning',
  },
  {
    id: 'day-2',
    description: 'Supermercado Extra',
    categoryId: 'mercado',
    categoryLabel: 'mercado',
    date: 'Oct 23, 2023',
    amount: 145.2,
    icon: 'shopping_cart',
    accentColor: 'negative',
  },
  {
    id: 'day-3',
    description: 'Uber Trip',
    categoryId: 'uber',
    categoryLabel: 'transporte',
    date: 'Oct 22, 2023',
    amount: 18.0,
    icon: 'directions_car',
    accentColor: 'neutral',
  },
]

export const topCategoriesToday = [
  { categoryId: 'mercado', label: 'Mercado', amount: 145.2, color: 'bg-secondary-fixed-dim' },
  { categoryId: 'lanche', label: 'Lanche', amount: 45.0, color: 'bg-warning-amber' },
]

export const categoryBreakdown: CategoryBreakdownItem[] = [
  { categoryId: 'mercado', label: 'mercado', percent: 40, amount: 1700.0, color: 'bg-negative-rose' },
  { categoryId: 'lanche', label: 'lanche', percent: 30, amount: 1275.0, color: 'bg-warning-amber' },
  { categoryId: 'outros', label: 'Other', percent: 30, amount: 1275.0, color: 'bg-outline' },
]

export const fixedExpenses: FixedExpense[] = [
  {
    id: 'fixed-1',
    description: 'conta de celular',
    tags: ['Utilities', 'Recurring'],
    amount: 85.0,
    status: 'unpaid',
    dueDate: 'Oct 15',
    icon: 'phone_iphone',
    urgent: true,
  },
  {
    id: 'fixed-2',
    description: 'Rent',
    tags: ['Housing'],
    amount: 1200.0,
    status: 'paid',
    dueDate: 'Oct 01',
    icon: 'home',
  },
  {
    id: 'fixed-3',
    description: 'Netflix Subscription',
    tags: ['Entertainment'],
    amount: 15.99,
    status: 'unpaid',
    dueDate: 'Oct 20',
    icon: 'movie',
  },
]
