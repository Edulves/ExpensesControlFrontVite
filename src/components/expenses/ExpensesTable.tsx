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
            <div className="overflow-x-auto flex-grow">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-border-subtle bg-surface-container-low">
                            <th className="py-3 px-6 font-label-caps text-xs text-on-surface-variant font-semibold">Date</th>
                            <th className="py-3 px-6 font-label-caps text-xs text-on-surface-variant font-semibold">Description</th>
                            <th className="py-3 px-6 font-label-caps text-xs text-on-surface-variant font-semibold">Category</th>
                            <th className="py-3 px-6 font-label-caps text-xs text-on-surface-variant font-semibold text-right">Amount</th>
                            <th className="py-3 px-6 font-label-caps text-xs text-on-surface-variant font-semibold text-right">Actions</th>
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
                                    -${expense.amount.toFixed(2)}
                                </td>
                                <td className="py-3 px-6 text-right">
                                    <div className="inline-flex items-center justify-end gap-1">
                                        <button
                                            type="button"
                                            title="Edit"
                                            onClick={() => onEdit?.(expense)}
                                            className="text-on-surface-variant hover:text-primary transition-colors p-1 rounded"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                        </button>
                                        <button
                                            type="button"
                                            title="Delete"
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
            <div className="p-3 border-t border-border-subtle bg-surface-bright flex justify-center">
                <button className="text-primary font-label-caps text-xs font-semibold hover:underline">View All Logs</button>
            </div>
        </div>
    );
}
