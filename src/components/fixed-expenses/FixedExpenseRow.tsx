import type { FixedExpense } from "../../types";

interface FixedExpenseRowProps {
    expense: FixedExpense;
    onTogglePaid?: (expense: FixedExpense) => void;
    onEdit?: (expense: FixedExpense) => void;
    onDelete?: (expense: FixedExpense) => void;
}

export default function FixedExpenseRow({ expense, onTogglePaid, onEdit, onDelete }: FixedExpenseRowProps) {
    const stripeColor = expense.urgent ? "bg-warning-amber" : "bg-border-subtle";

    return (
        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-4 p-4 border-b border-border-subtle last:border-b-0 items-center hover:bg-surface-bright transition-colors group">
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${stripeColor}`} />

            <div className="col-span-1 md:col-span-5 flex items-center gap-3 pl-3">
                <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant flex-shrink-0">
                    <span className="material-symbols-outlined">{expense.icon}</span>
                </div>
                <div className="min-w-0">
                    <h3 className="font-title-md text-base font-semibold text-on-background truncate">{expense.description}</h3>
                </div>
            </div>

            <div
                className={`col-span-1 md:col-span-2 flex justify-between md:justify-end md:text-right font-label-numeric text-base font-medium ${
                    expense.status === "paid" ? "text-on-surface-variant" : "text-on-background"
                }`}
            >
                <span className="md:hidden text-on-surface-variant">Valor:</span>
                <span>{expense.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-start md:justify-center">
                {expense.status === "paid" ? (
                    <button
                        type="button"
                        title="Marcar como não pago"
                        onClick={() => onTogglePaid?.(expense)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-positive-emerald border border-positive-emerald/20 font-label-caps text-xs font-semibold cursor-pointer hover:brightness-90 transition-[filter]"
                    >
                        <span className="material-symbols-outlined text-[14px]">check</span> Pago
                    </button>
                ) : expense.urgent ? (
                    <button
                        type="button"
                        title="Marcar como pago"
                        onClick={() => onTogglePaid?.(expense)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-warning-amber border border-warning-amber/20 font-label-caps text-xs font-semibold cursor-pointer hover:brightness-90 transition-[filter]"
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-warning-amber" /> Não pago
                    </button>
                ) : (
                    <button
                        type="button"
                        title="Marcar como pago"
                        onClick={() => onTogglePaid?.(expense)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-high text-on-surface-variant border border-border-subtle font-label-caps text-xs font-semibold cursor-pointer hover:brightness-90 transition-[filter]"
                    >
                        Não pago
                    </button>
                )}
            </div>

            <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end md:text-right font-body-sm text-base text-on-surface-variant">
                <span className="md:hidden">Vence:</span>
                <span className={expense.urgent ? "font-bold text-on-background" : undefined}>{expense.dueDate}</span>
            </div>

            <div className="hidden md:flex col-span-1 justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="inline-flex items-center justify-center gap-1">
                    <button
                        type="button"
                        title="Editar"
                        onClick={() => onEdit?.(expense)}
                        className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                    </button>
                    <button
                        type="button"
                        title="Excluir"
                        onClick={() => onDelete?.(expense)}
                        className="text-on-surface-variant hover:text-negative-rose transition-colors p-1 rounded"
                    >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
