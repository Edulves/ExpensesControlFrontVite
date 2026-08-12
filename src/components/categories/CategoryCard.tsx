import type { Category } from '../../types'

interface CategoryCardProps {
  category: Category
  onEdit?: (category: Category) => void
}

export default function CategoryCard({ category, onEdit }: CategoryCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-3 flex flex-col items-center justify-center text-center hover:border-primary-container transition-colors cursor-pointer group relative overflow-hidden">
      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center mb-3 text-primary-container group-hover:scale-110 transition-transform">
        <span className="material-symbols-outlined">{category.icon}</span>
      </div>
      <span className="font-body-sm text-sm font-semibold text-primary">
        {category.name}
      </span>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit?.(category)
          }}
          className="text-outline hover:text-primary"
        >
          <span className="material-symbols-outlined text-[16px]">edit</span>
        </button>
      </div>
    </div>
  )
}
