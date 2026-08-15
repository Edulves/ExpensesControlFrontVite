import type { NavItem } from '../types'

// Itens do menu lateral. NÃO é dado de negócio: são metadados de UI acoplados
// às rotas registradas no App.tsx (React Router). Por isso ficam como
// configuração estática do frontend, e não vêm da API.
export const navItems: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { label: 'Registro de Despesas', icon: 'receipt_long', path: '/expenses' },
  { label: 'Despesas Fixas', icon: 'calendar_today', path: '/fixed-expenses' },
]
