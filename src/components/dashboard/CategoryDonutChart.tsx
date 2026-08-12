import type { CategoryBreakdownItem } from '../../types'

interface CategoryDonutChartProps {
  items: CategoryBreakdownItem[]
  topCategoryLabel: string
}

// Map the tailwind background classes used in the legend to real colors for the conic-gradient.
const colorHex: Record<string, string> = {
  'bg-negative-rose': '#F43F5E',
  'bg-warning-amber': '#F59E0B',
  'bg-outline': '#73777e',
  'bg-secondary-fixed-dim': '#4edea3',
}

function buildGradient(items: CategoryBreakdownItem[]) {
  let cursor = 0
  const stops = items.map((item) => {
    const start = cursor
    cursor += item.percent
    const color = colorHex[item.color] ?? '#73777e'
    return `${color} ${start}% ${cursor}%`
  })
  return `conic-gradient(${stops.join(', ')})`
}

export default function CategoryDonutChart({
  items,
  topCategoryLabel,
}: CategoryDonutChartProps) {
  return (
    <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
      <h3 className="font-title-md text-xl font-semibold text-primary w-full text-left mb-3 border-b border-border-subtle pb-2">
        Category Breakdown
      </h3>
      <div
        className="relative w-48 h-48 rounded-full flex items-center justify-center mt-4"
        style={{ background: buildGradient(items) }}
      >
        <div className="absolute inset-2 bg-surface-container-lowest rounded-full flex flex-col items-center justify-center">
          <span className="font-label-caps text-xs font-semibold text-outline">Top Category</span>
          <span className="font-title-md text-xl font-semibold text-primary">{topCategoryLabel}</span>
        </div>
      </div>
      <div className="mt-6 w-full space-y-2">
        {items.map((item) => (
          <div key={item.categoryId} className="flex justify-between items-center text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.color}`} />
              <span className="font-body-sm text-sm text-on-surface-variant">
                {item.label} ({item.percent}%)
              </span>
            </div>
            <span className="font-label-numeric text-sm font-medium">
              -${item.amount.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
