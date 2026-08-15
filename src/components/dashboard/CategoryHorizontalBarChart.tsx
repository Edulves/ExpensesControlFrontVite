import type { CategoryBreakdownItem } from '../../types'
import { colorHex } from './categoryColors'

interface CategoryHorizontalBarChartProps {
  items: CategoryBreakdownItem[]
  topCategoryLabel: string
  onHoverChange?: (item: CategoryBreakdownItem | null) => void
}

// Ícones por categoria (mapeamento por nome da categoria)
const categoryIcons: Record<string, string> = {
  lanche: 'fastfood',
  mercado: 'shopping_cart',
  uber: 'directions_car',
  farmacia: 'medication',
  lazer: 'celebration',
  'cuidado pessoal': 'spa',
  'gastos avulsos': 'receipt_long',
  pao: 'bakery_dining',
  'adiantamento cartao de credito': 'credit_card',
  cursos: 'school',
  'cartao de credito': 'credit_score',
  'despesas medicas': 'medical_services',
  'servicos de assinatura': 'subscriptions',
  investimento: 'trending_up',
  moradia: 'home',
  moto: 'motorcycle',
  games: 'sports_esports',
  'despesas dentista': 'dentistry',
  // compatibilidade com nomes alternativos usados anteriormente
  transporte: 'directions_car',
  transport: 'directions_car',
  aluguel: 'home',
  energia: 'bolt',
  agua: 'water_drop',
  internet: 'wifi',
  celular: 'phone_iphone',
  assinaturas: 'movie',
  alimentacao: 'restaurant',
  comida: 'restaurant',
  carro: 'directions_car',
  saude: 'medication',
  outros: 'category',
  other: 'category',
}

function iconFor(item: CategoryBreakdownItem): string {
  const key = (item.categoryId || item.label || '').toLowerCase()
  return categoryIcons[key] ?? 'category'
}

export default function CategoryHorizontalBarChart({
  items,
  topCategoryLabel,
  onHoverChange,
}: CategoryHorizontalBarChartProps) {
  // Ordena do maior percentual para o menor
  const sorted = [...items].sort((a, b) => b.percent - a.percent)

  return (
    <div
      className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 flex flex-col flex-1 min-h-0"
      onMouseLeave={() => onHoverChange?.(null)}
    >
      <h3 className="font-title-md text-xl font-semibold text-primary w-full mb-4 border-b border-border-subtle pb-2">
        Participação por Categoria
      </h3>

      {items.length === 0 ? (
        <p className="font-body-sm text-sm text-on-surface-variant text-center py-8">
          Nenhuma categoria com gastos no período.
        </p>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {sorted.map((item) => {
            const hex = colorHex[item.color] ?? '#73777e'
            const isTop = item.label === topCategoryLabel

            return (
              <div
                key={item.categoryId}
                className="group relative flex items-center gap-3 p-3 rounded-xl border border-border-subtle bg-surface-container-lowest hover:bg-surface-bright hover:shadow-md transition-all duration-200 cursor-pointer"
                onMouseEnter={() => onHoverChange?.(item)}
                onMouseLeave={() => onHoverChange?.(null)}
              >
                {/* Indicador de cor (bolinha) */}
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ backgroundColor: hex, outline: `2px solid ${hex}`, outlineOffset: '1px' }}
                />

                {/* Ícone */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${hex}18`, color: hex }}
                >
                  <span className="material-symbols-outlined text-xl">{iconFor(item)}</span>
                </div>

                {/* Labels */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline gap-2">
                    <h4 className="font-body-lg text-sm font-medium text-on-surface truncate capitalize">
                      {item.label}
                      {isTop && (
                        <span className="ml-1.5 font-label-caps text-[10px] text-positive-emerald">
                          TOP
                        </span>
                      )}
                    </h4>
                    <span className="font-label-numeric text-sm font-semibold text-on-surface flex-shrink-0">
                      {(-item.amount).toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </span>
                  </div>

                  {/* Barra de progresso */}
                  <div className="mt-1.5 w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 group-hover:brightness-110"
                      style={{
                        width: `${Math.min(100, Math.max(0, item.percent))}%`,
                        backgroundColor: hex,
                      }}
                    />
                  </div>

                  {/* Percentual no final da barra */}
                  <span className="font-label-caps text-[11px] font-semibold mt-0.5 block" style={{ color: hex }}>
                    {item.percent}% do total
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}