import AppShell from '../components/layout/AppShell'
import StatCard from '../components/ui/StatCard'
import RecentExpensesList from '../components/dashboard/RecentExpensesList'
import CategoryDonutChart from '../components/dashboard/CategoryDonutChart'
import { categoryBreakdown, recentExpenses } from '../data'

export default function DashboardPage() {
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
          <RecentExpensesList expenses={recentExpenses} />
        </div>

        {/* Category Breakdown */}
        <div className="lg:col-span-4 grid grid-cols-1 gap-6">
          <CategoryDonutChart items={categoryBreakdown} topCategoryLabel="mercado" />
        </div>
      </div>
    </AppShell>
  )
}
