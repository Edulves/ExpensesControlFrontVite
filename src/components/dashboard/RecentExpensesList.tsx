import type { CategoryBreakdownItem } from '../../types'
import { colorHex } from './categoryColors'

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
      <div className="flex-1 overflow-y-auto max-h-[400px] p-4">
        {items.length === 0 && (
          <p className="font-body-sm text-sm text-on-surface-variant p-6 text-center">
            Nenhuma categoria com gastos no período.
          </p>
        )}
        <div className="grid grid-cols-1 gap-4">
          {items.map((item) => {
            const hex = colorHex[item.color] ?? '#73777e'
            return (
              <div
                key={item.categoryId}
                className="bg-surface-container-lowest p-4 rounded-xl border border-border-subtle shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden"
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${item.color}`} />
                <div className="flex justify-between items-center mb-3 pl-1">
                  <div className="flex items-center gap-4 min-w-0">
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${hex}22`, color: hex }}
                    >
                      <span className="material-symbols-outlined">{iconFor(item)}</span>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-body-lg text-base text-on-surface font-medium truncate capitalize">
                        {item.label}
                      </h4>
                      <p className="font-body-sm text-sm text-on-surface-variant">
                        {item.percent}% do gasto do mês
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0 pl-2">
                    <p className="font-label-numeric text-sm font-medium text-on-surface font-semibold">
                      -${item.amount.toFixed(2)}
                    </p>
                    <p className="font-label-caps text-xs font-semibold" style={{ color: hex }}>
                      {item.percent}%
                    </p>
                  </div>
                </div>
                {/* Barra de progresso arredondada: participação da categoria no total do mês */}
                <div className="pl-1 w-full bg-surface-container-high h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, item.percent))}%`,
                      backgroundColor: hex,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
