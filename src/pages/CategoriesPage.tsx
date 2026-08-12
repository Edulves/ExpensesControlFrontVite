import AppShell from '../components/layout/AppShell'
import CategoryCard from '../components/categories/CategoryCard'
import { categories } from '../data'
import type { Category } from '../types'

export default function CategoriesPage() {
  const handleEdit = (category: Category) => {
    console.log('edit category', category)
  }

  const handleNewCategory = () => {
    console.log('new category')
  }

  return (
    <AppShell
      title="Manage Categories"
      subtitle={`Organize your spending tracking with ${categories.length} custom categories.`}
      searchPlaceholder="Search categories..."
    >
      {/* Page Header */}
      <div className="flex justify-end mb-6">
        <button
          onClick={handleNewCategory}
          className="bg-primary text-on-primary font-body-sm text-sm py-2 px-4 rounded flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Category
        </button>
      </div>

      {/* Bento Grid Layout for Categories */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} onEdit={handleEdit} />
        ))}
      </div>
    </AppShell>
  )
}
