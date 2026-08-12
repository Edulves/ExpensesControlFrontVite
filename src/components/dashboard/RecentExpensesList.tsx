import type { Expense } from '../../types'

interface RecentExpensesListProps {
  expenses: Expense[]
}

const accentClasses: Record<Expense['accentColor'], string> = {
  warning: 'bg-warning-amber',
  negative: 'bg-negative-rose',
  neutral: 'bg-outline',
}

export default function RecentExpensesList({ expenses }: RecentExpensesListProps) {
  return (
    <div className="bg-surface-container-lowest border border-border-subtle rounded-xl flex flex-col overflow-hidden">
      <div className="p-3 border-b border-border-subtle flex justify-between items-center bg-surface-bright">
        <h2 className="font-title-md text-xl font-semibold text-primary">Recent Daily Expenses</h2>
        <button className="text-primary font-label-caps text-xs font-semibold hover:underline">
          View All
        </button>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[400px]">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between p-3 border-b border-border-subtle last:border-b-0 hover:bg-surface-bright transition-colors relative pl-6"
          >
            <div
              className={`absolute left-0 top-0 bottom-0 w-1 ${accentClasses[expense.accentColor]}`}
            />
            <div className="flex items-center gap-4 min-w-0">
              <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined">{expense.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="font-body-lg text-base text-on-surface font-medium truncate">
                  {expense.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="font-label-caps text-xs font-semibold bg-surface-container-high text-on-surface-variant px-2 py-0.5 rounded">
                    {expense.categoryLabel}
                  </span>
                  <span className="font-body-sm text-sm text-outline">
                    {expense.date}
                  </span>
                </div>
              </div>
            </div>
            <div className="font-label-numeric text-sm font-medium text-on-surface font-semibold flex-shrink-0 pl-2">
              -${expense.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
