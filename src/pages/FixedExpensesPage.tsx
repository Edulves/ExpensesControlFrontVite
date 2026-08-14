import AppShell from '../components/layout/AppShell'
import FixedExpenseRow from '../components/fixed-expenses/FixedExpenseRow'
import { fixedExpenses } from '../data'

export default function FixedExpensesPage() {
  return (
    <AppShell
      title="Despesas Fixas"
      subtitle="Gerencie suas contas e assinaturas recorrentes."
    >
      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-border-subtle flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-on-surface-variant">payments</span>
            <span className="font-label-caps text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Total Fixo Mensal
            </span>
          </div>
          <div className="font-display-lg text-5xl font-bold text-primary mt-2">
            <span className="font-label-numeric text-xl font-semibold align-top">R$</span>
            1.450<span className="font-label-numeric text-xl font-semibold">,00</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-border-subtle flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-positive-emerald">
              check_circle
            </span>
            <span className="font-label-caps text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Pago Este Mês
            </span>
          </div>
          <div className="font-display-lg text-5xl font-bold text-on-background mt-2">
            <span className="font-label-numeric text-xl font-semibold align-top">R$</span>
            850<span className="font-label-numeric text-xl font-semibold">,00</span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-4">
            <div className="bg-positive-emerald h-1.5 rounded-full" style={{ width: '58%' }} />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-6 rounded-xl border border-border-subtle flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <span className="material-symbols-outlined text-warning-amber">pending</span>
            <span className="font-label-caps text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
              Próximos (Próximos 7 Dias)
            </span>
          </div>
          <div className="font-display-lg text-5xl font-bold text-on-background mt-2">
            <span className="font-label-numeric text-xl font-semibold align-top">R$</span>
            120<span className="font-label-numeric text-xl font-semibold">,00</span>
          </div>
          <p className="font-body-sm text-sm text-on-surface-variant mt-2">
            2 contas pendentes
          </p>
        </div>
      </div>

      {/* Main Content Area: Fixed Expenses List */}
      <div className="bg-surface-container-lowest rounded-xl border border-border-subtle overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-bright">
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-border-subtle rounded-lg font-body-sm text-sm hover:bg-surface-container-low transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined">filter_list</span> Filtrar
            </button>
            <button className="px-4 py-2 border border-border-subtle rounded-lg font-body-sm text-sm hover:bg-surface-container-low transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined">sort</span> Ordenar
            </button>
          </div>
          <button className="md:hidden bg-primary text-on-primary font-body-sm py-2 px-4 rounded-lg flex items-center gap-2 hover:bg-primary-container">
            <span className="material-symbols-outlined text-sm">add</span> Nova
          </button>
        </div>

        {/* List Header (Desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border-subtle bg-surface-container-low text-on-surface-variant font-label-caps text-xs font-semibold uppercase tracking-wider">
          <div className="col-span-5 pl-2">Descrição</div>
          <div className="col-span-2 text-right">Valor</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-2 text-right">Vencimento</div>
          <div className="col-span-1 text-center">Ação</div>
        </div>

        {/* Expense Rows */}
        <div className="flex flex-col">
          {fixedExpenses.map((expense) => (
            <FixedExpenseRow key={expense.id} expense={expense} />
          ))}
        </div>
      </div>
    </AppShell>
  )
}
