import type { Expense } from "../../types";

interface ExpensesTableProps {
    expenses: Expense[];
    onEdit?: (expense: Expense) => void;
    onDelete?: (expense: Expense) => void;
}

const categoryPillClasses: Record<string, string> = {
    lanche: "bg-warning-amber/10 text-warning-amber",
    mercado: "bg-secondary-fixed-dim/20 text-on-secondary-fixed-variant",
    uber: "bg-surface-tint/10 text-surface-tint",
};

export default function ExpensesTable({ expenses, onEdit, onDelete }: ExpensesTableProps) {
    return (
        <div className="lg:col-span-2 bg-surface-container-lowest border border-border-subtle rounded-xl p-0 overflow-hidden flex flex-col">
            {/* Desktop table (lg and above) */}
            <div className="hidden lg:block overflow-x-auto flex-grow">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border-subtle bg-surface-container-low">
                            <th className="py-3 px-6 font-label-caps text-xs text-on-surface-variant font-semibold">Data</th>
                            <th className="py-3 px-6 font-label-caps text-xs text-on-surface-variant font-semibold">Descrição</th>
                            <th className="py-3 px-6 font-label-caps text-xs text-on-surface-variant font-semibold">Categoria</th>
                            <th className="py-3 px-6 font-label-caps text-xs text-on-surface-variant font-semibold text-right">Valor</th>
                            <th className="py-3 px-6 font-label-caps text-xs text-on-surface-variant font-semibold text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="font-body-sm text-sm">
                        {expenses.map((expense) => (
                            <tr
                                key={expense.id}
                                className="border-b border-border-subtle last:border-b-0 hover:bg-surface-bright transition-colors relative group"
                            >
                                <td className="py-3 px-6 text-on-surface-variant whitespace-nowrap">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-negative-rose opacity-0 group-hover:opacity-100 transition-opacity" />
                                    {expense.date}
                                </td>
                                <td className="py-3 px-6 font-medium text-on-surface">{expense.description}</td>
                                <td className="py-3 px-6">
                                    <span
                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded font-label-caps text-[10px] ${
                                            categoryPillClasses[expense.categoryId] ?? "bg-surface-container-high text-on-surface-variant"
                                        }`}
                                    >
                                        {expense.categoryLabel}
                                    </span>
                                </td>
                                <td className="py-3 px-6 text-right font-label-numeric text-sm font-medium text-on-surface">
                                    {(-expense.amount).toLocaleString("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </td>
                                <td className="py-3 px-6 text-right">
                                    <div className="inline-flex items-center justify-end gap-1">
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
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile & tablet: stacked cards to avoid horizontal scroll */}
            <div className="lg:hidden flex flex-col">
                {expenses.map((expense) => (
                    <div
                        key={expense.id}
                        className="relative p-4 border-b border-border-subtle last:border-b-0 hover:bg-surface-bright transition-colors"
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-negative-rose opacity-40" />
                        <div className="flex items-center justify-between gap-3">
                            <span className="font-body-sm text-base text-on-surface-variant">{expense.date}</span>
                            <span className="font-label-numeric text-base font-medium text-on-surface">
                                {(-expense.amount).toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                })}
                            </span>
                        </div>
                        <div className="mt-2 font-medium text-on-surface">{expense.description}</div>
                        <div className="mt-2 flex items-center justify-between gap-3">
                            <span
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded font-label-caps text-[10px] ${
                                    categoryPillClasses[expense.categoryId] ?? "bg-surface-container-high text-on-surface-variant"
                                }`}
                            >
                                {expense.categoryLabel}
                            </span>
                            <div className="inline-flex items-center justify-end gap-1">
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
                ))}
            </div>
        </div>
    );
}
