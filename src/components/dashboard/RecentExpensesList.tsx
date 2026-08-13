import type { CategoryBreakdownItem } from '../../types'

interface RecentExpensesListProps {
  items: CategoryBreakdownItem[]
}

// Ícones de categoria já usados no projeto (data.ts). Fallback genérico caso o
// nome da categoria vindo da API não esteja mapeado.
const categoryIcons: Record<string, string> = {
  lanche: 'fastfood',
  mercado: 'shopping_cart',
  uber: 'directions_car',
  transporte: 'directions_car',
  transport: 'directions_car',
  farmacia: 'medication',
  aluguel: 'home',
  energia: 'bolt',
  agua: 'water_drop',
  internet: 'wifi',
  celular: 'phone_iphone',
  assinaturas: 'movie',
  alimentacao: 'restaurant',
  comida: 'restaurant',
  carro: 'directions_car',
  moradia: 'home',
  saude: 'medication',
  outros: 'category',
  other: 'category',
}
const fallbackIcon = 'category'

function iconFor(item: CategoryBreakdownItem): string {
  const key = (item.categoryId || item.label || '').toLowerCase()
  return categoryIcons[key] ?? fallbackIcon
}

export default function RecentExpensesList({ items }: RecentExpensesListProps) {
  return (
    <div className="bg-surface-container-lowest border border-border-subtle rounded-xl flex flex-col overflow-hidden">
      <div className="p-3 border-b border-border-subtle flex justify-between items-center bg-surface-bright">
        <h2 className="font-title-md text-xl font-semibold text-primary">Despesas Por Categoria</h2>
        <button className="text-primary font-label-caps text-xs font-semibold hover:underline">
          View All
        </button>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[400px]">
        {items.length === 0 && (
          <p className="font-body-sm text-sm text-on-surface-variant p-6 text-center">
            Nenhuma categoria com gastos no período.
          </p>
        )}
        {items.map((item) => (
          <div
            key={item.categoryId}
            className="flex items-center justify-between p-3 border-b border-border-subtle last:border-b-0 hover:bg-surface-bright transition-colors relative pl-6"
          >
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.color}`} />
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined">{iconFor(item)}</span>
              </div>
              <div className="min-w-0">
                <p className="font-body-lg text-base text-on-surface font-medium truncate">
                  {item.label}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="font-label-caps text-xs font-semibold bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded">
                    {item.percent}% of spend
                  </span>
                </div>
              </div>
            </div>
            <div className="font-label-numeric text-sm font-medium text-on-surface font-semibold flex-shrink-0 pl-2">
              -${item.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
