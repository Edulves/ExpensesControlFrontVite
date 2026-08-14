import { useRef, useState, type MouseEvent } from 'react'
import type { CategoryBreakdownItem } from '../../types'
import { colorHex } from './categoryColors'

interface CategoryDonutChartProps {
  items: CategoryBreakdownItem[]
  topCategoryLabel: string
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
  const donutRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<CategoryBreakdownItem | null>(null)

  // Determina qual segmento da rosca está sob o cursor, convertendo a posição
  // do mouse em um ângulo e comparando com os percentuais acumulados (o
  // conic-gradient inicia no topo e avança no sentido horário).
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = donutRef.current
    if (!el || items.length === 0) {
      setHovered(null)
      return
    }

    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const radius = rect.width / 2
    const distance = Math.hypot(dx, dy)

    // O "buraco" central usa inset-2 (8px); ignora o hover sobre ele.
    if (distance < radius - 8) {
      setHovered(null)
      return
    }

    let angle = Math.atan2(dy, dx) * (180 / Math.PI)
    const cwDeg = (angle + 90 + 360) % 360

    let cumulative = 0
    let found: CategoryBreakdownItem | null = null
    for (const item of items) {
      const start = cumulative * 3.6
      const end = (cumulative + item.percent) * 3.6
      if (cwDeg >= start && cwDeg < end) {
        found = item
        break
      }
      cumulative += item.percent
    }

    setHovered(found)
  }

  const handleMouseLeave = () => setHovered(null)

  return (
    <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
      <h3 className="font-title-md text-xl font-semibold text-primary w-full text-left mb-3 border-b border-border-subtle pb-2">
        Participação por Categoria
      </h3>
      <div
        ref={donutRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-48 h-48 rounded-full flex items-center justify-center mt-4 cursor-pointer select-none"
        style={{ background: buildGradient(items) }}
      >
        <div className="absolute inset-2 bg-surface-container-lowest rounded-full flex flex-col items-center justify-center pointer-events-none text-center px-3">
          <span className="font-label-caps text-xs font-semibold text-outline truncate max-w-full">
            {hovered ? hovered.label.toUpperCase() : 'Categoria Principal'}
          </span>
          <span className="font-title-md text-xl font-semibold text-primary truncate max-w-full">
            {hovered ? `${hovered.percent}%` : topCategoryLabel}
          </span>
        </div>
      </div>
    </div>
  )
}
