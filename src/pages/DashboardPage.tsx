import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/layout/AppShell'
import StatCard from '../components/ui/StatCard'
import RecentExpensesList from '../components/dashboard/RecentExpensesList'
import CategoryHorizontalBarChart from '../components/dashboard/CategoryHorizontalBarChart'
import { fetchExpensesPerCategory, fetchTotalDailyExpenses, fetchFixedExpensesConsolidation, type ExpenseByCategory } from '../services/api'
import { getCookie } from '../utils/cookies'
import type { CategoryBreakdownItem } from '../types'

const MONTHS = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
]

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
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [fixedPaid, setFixedPaid] = useState(0)
  const [fixedPending, setFixedPending] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notAuthenticated, setNotAuthenticated] = useState(false)

  // Rascunho do filtro (Mês/Ano) e valores já aplicados aos endpoints.
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [appliedMonth, setAppliedMonth] = useState(now.getMonth() + 1)
  const [appliedYear, setAppliedYear] = useState(now.getFullYear())

  const handleMonthChange = (value: number) => {
    setMonth(value)
    setAppliedMonth(value)
    loadCategoryBreakdown(value, appliedYear)
  }

  const handleYearChange = (value: number) => {
    setYear(value)
    setAppliedYear(value)
    loadCategoryBreakdown(appliedMonth, value)
  }

  const loadCategoryBreakdown = async (monthToUse: number, yearToUse: number) => {
    const token = getCookie('authToken')

    if (!token) {
      setNotAuthenticated(true)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const [data, total, consolidation] = await Promise.all([
        fetchExpensesPerCategory({ month: monthToUse, year: yearToUse }),
        fetchTotalDailyExpenses({ month: monthToUse, year: yearToUse }),
        fetchFixedExpensesConsolidation(monthToUse, yearToUse),
      ])

      setTotalExpenses(total)
      setFixedPaid(consolidation.paidValue)
      setFixedPending(consolidation.notPaidValue)
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
    loadCategoryBreakdown(appliedMonth, appliedYear)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AppShell title="Dashboard">
      <div className="flex flex-col h-full min-h-0">
      {/* Filters: Mês e Ano */}
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6 -mt-2">
        <div className="flex flex-wrap items-end gap-3">
          {/* Month Select */}
          <div className="space-y-1">
            <label
              className="font-label-caps text-xs font-semibold text-on-surface block"
              htmlFor="dashboard-month"
            >
              Mês
            </label>
            <select
              id="dashboard-month"
              className="bg-surface-container-lowest border border-border-subtle rounded-lg px-3 py-2 font-body-lg text-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              value={month}
              onChange={(e) => handleMonthChange(Number(e.target.value))}
            >
              {MONTHS.map((name, index) => (
                <option key={index + 1} value={index + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Select */}
          <div className="space-y-1">
            <label
              className="font-label-caps text-xs font-semibold text-on-surface block"
              htmlFor="dashboard-year"
            >
              Ano
            </label>
            <select
              id="dashboard-year"
              className="bg-surface-container-lowest border border-border-subtle rounded-lg px-3 py-2 font-body-lg text-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              value={year}
              onChange={(e) => handleYearChange(Number(e.target.value))}
            >
              {Array.from({ length: 10 }, (_, i) => now.getFullYear() - 5 + i).map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6 grid-rows-[auto_1fr]">
        {/* Summary Cards Row */}
        <div className="lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            label="Total de Despesas"
            sublabel="Este Mês"
            icon="account_balance"
            accentColor="bg-negative-rose"
          >
            <span className="font-display-lg text-5xl font-bold text-primary">
              R${' '}
              <span className="font-label-numeric">
                {totalExpenses.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </span>
          </StatCard>

          <StatCard label="Despesas Fixas" sublabel="Valor pago no mês" icon="event_repeat">
            <span className="font-title-md text-xl font-semibold text-primary">
              R$ <span className="font-label-numeric">{fixedPaid.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}</span>
            </span>
          </StatCard>

          <StatCard label="Estimativa Restante" sublabel="Valor pendente no mês" icon="savings">
            <span className="font-title-md text-xl font-semibold text-positive-emerald">
              R$ <span className="font-label-numeric">{fixedPending.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}</span>
            </span>
          </StatCard>
        </div>

        {/* Category Breakdown (Principal) */}
        <div className="lg:col-span-12 min-h-0 flex flex-col">
          {loading ? (
            <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 flex flex-col items-center justify-center flex-1 min-h-0">
              <span className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="font-body-sm text-sm text-on-surface-variant mt-3">
                Carregando categorias...
              </p>
            </div>
          ) : error ? (
            <div className="bg-surface-container-lowest border border-negative-rose rounded-xl p-6 flex flex-col items-center justify-center text-center flex-1 min-h-0">
              <p className="font-body-lg text-base text-negative-rose mb-1">Erro</p>
              <p className="font-body-sm text-sm text-on-surface-variant mb-4">{error}</p>
              <button
                type="button"
                onClick={() => loadCategoryBreakdown(appliedMonth, appliedYear)}
                className="bg-primary text-on-primary font-body-lg text-base py-2 px-6 rounded-lg hover:bg-primary-container transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          ) : (
            <CategoryHorizontalBarChart
              items={breakdownItems}
              topCategoryLabel={topCategoryLabel}
            />
          )}
        </div>
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
