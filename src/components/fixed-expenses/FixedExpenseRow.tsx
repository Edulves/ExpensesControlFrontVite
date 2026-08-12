import type { FixedExpense } from '../../types'

interface FixedExpenseRowProps {
  expense: FixedExpense
}

export default function FixedExpenseRow({ expense }: FixedExpenseRowProps) {
  const stripeColor = expense.urgent ? 'bg-warning-amber' : 'bg-border-subtle'

  return (
    <div className="relative grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-border-subtle last:border-b-0 items-center hover:bg-surface-bright transition-colors group">
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${stripeColor}`} />

      <div className="col-span-1 md:col-span-5 flex items-center gap-3 pl-3">
        <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant flex-shrink-0">
          <span className="material-symbols-outlined">{expense.icon}</span>
        </div>
        <div className="min-w-0">
          <h3 className="font-title-md text-xl font-semibold text-on-background truncate">
            {expense.description}
          </h3>
          <div className="flex gap-2 mt-1 flex-wrap">
            {expense.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-caps text-[10px] uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`col-span-1 md:col-span-2 flex justify-between md:justify-end md:text-right font-label-numeric text-sm font-medium ${
          expense.status === 'paid' ? 'text-on-surface-variant' : 'text-on-background'
        }`}
      >
        <span className="md:hidden text-on-surface-variant">Amount:</span>
        <span>${expense.amount.toFixed(2)}</span>
      </div>

      <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
        {expense.status === 'paid' ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-positive-emerald border border-positive-emerald/20 font-label-caps text-xs font-semibold">
            <span className="material-symbols-outlined text-[14px]">check</span> Paid
          </span>
        ) : expense.urgent ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-warning-amber border border-warning-amber/20 font-label-caps text-xs font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-warning-amber" /> Unpaid
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant border border-border-subtle font-label-caps text-xs font-semibold">
            Unpaid
          </span>
        )}
      </div>

      <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end md:text-right font-body-sm text-sm text-on-surface-variant">
        <span className="md:hidden">Due:</span>
        <span className={expense.urgent ? 'font-bold text-on-background' : undefined}>
          {expense.dueDate}
        </span>
      </div>

      <div className="hidden md:flex col-span-1 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="w-8 h-8 rounded hover:bg-surface-container flex items-center justify-center text-on-surface-variant">
          <span className="material-symbols-outlined text-[20px]">more_vert</span>
        </button>
      </div>
    </div>
  )
}
