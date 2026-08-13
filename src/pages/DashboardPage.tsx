import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import StatCard from '../components/ui/StatCard'
import RecentExpensesList from '../components/dashboard/RecentExpensesList'
import CategoryDonutChart from '../components/dashboard/CategoryDonutChart'
import { fetchExpensesPerCategory, type ExpenseByCategory } from '../services/api'
import { getCookie } from '../utils/cookies'
import type { CategoryBreakdownItem } from '../types'

// Converte o retorno da API (ExpenseByCategory[]) no formato esperado pelo
// CategoryDonutChart (CategoryBreakdownItem[]), calculando o percentual de cada
// categoria em relação ao total consolidado.
function toBreakdownItems(
  categories: ExpenseByCategory[],
  total: number,
): CategoryBreakdownItem[] {
  const sum = total > 0 ? total : categories.reduce((s, c) => s + c.amount, 0)

  return categories.map((category) => ({
    categoryId: category.categoryId,
    label: category.label,
    percent: sum > 0 ? Math.round((category.amount / sum) * 100) : 0,
    amount: category.amount,
    color: category.color,
  }))
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const now = new Date()

  const [breakdownItems, setBreakdownItems] = useState<CategoryBreakdownItem[]>([])
  const [topCategoryLabel, setTopCategoryLabel] = useState('—')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notAuthenticated, setNotAuthenticated] = useState(false)

  const loadCategoryBreakdown = async () => {
    const token = getCookie('authToken')

    if (!token) {
      setNotAuthenticated(true)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const data = await fetchExpensesPerCategory({
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      })

      setBreakdownItems(toBreakdownItems(data.categories, data.total))

      // Categoria com maior valor consolidado é exibida no centro do donut.
      const top = data.categories.reduce(
        (max, c) => (c.amount > max.amount ? c : max),
        data.categories[0],
      )
      setTopCategoryLabel(top ? top.label : '—')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar o breakdown de categorias.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCategoryBreakdown()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AppShell title="Dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Summary Cards Row */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Total Expenses"
            sublabel="This Month"
            icon="account_balance"
            accentColor="bg-negative-rose"
          >
            <span className="font-display-lg text-5xl font-bold text-primary">
              $<span className="font-label-numeric">4,250.00</span>
            </span>
          </StatCard>

          <StatCard label="Fixed Expenses" sublabel="Upcoming 7 days" icon="event_repeat">
            <span className="font-title-md text-xl font-semibold text-primary">
              $<span className="font-label-numeric">1,120.00</span>
            </span>
          </StatCard>

          <StatCard label="Estimated Remaining" sublabel="Based on fixed" icon="savings">
            <span className="font-title-md text-xl font-semibold text-positive-emerald">
              $<span className="font-label-numeric">850.00</span>
            </span>
          </StatCard>
        </div>

        {/* Recent Expenses */}
        <div className="lg:col-span-8 grid grid-cols-1 gap-6">
          <RecentExpensesList items={breakdownItems} />
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-4 grid grid-cols-1 gap-6">
          {loading ? (
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
              <span className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="font-body-sm text-sm text-on-surface-variant mt-3">
                Carregando categorias...
              </p>
            </div>
          ) : error ? (
            <div className="bg-surface-container-lowest border border-negative-rose rounded-xl p-6 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <p className="font-body-lg text-base text-negative-rose mb-1">Erro</p>
              <p className="font-body-sm text-sm text-on-surface-variant mb-4">{error}</p>
              <button
                type="button"
                onClick={loadCategoryBreakdown}
                className="bg-primary text-on-primary font-body-lg text-base py-2 px-6 rounded-lg hover:bg-primary-container transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <CategoryDonutChart items={breakdownItems} topCategoryLabel={topCategoryLabel} />
          )}
        </div>
      </div>

      {/* Not Authenticated Popup */}
      {notAuthenticated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm bg-surface-container-lowest border border-negative-rose rounded-xl p-6 shadow-lg text-center">
            <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-negative-rose/10 text-negative-rose">
              <span className="material-symbols-outlined text-2xl">lock</span>
            </div>
            <h2 className="font-display-md text-display-md mb-1 text-negative-rose">
              Não autenticado
            </h2>
            <p className="font-body-lg text-base text-on-surface-variant mb-6">
              Você não está logado. Faça login para acessar o dashboard.
            </p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full bg-primary text-on-primary font-body-lg text-base py-2 rounded-lg hover:bg-primary-container transition-colors"
            >
              Fazer Login
            </button>
          </div>
        </div>
      )}
    </AppShell>
  )
}
