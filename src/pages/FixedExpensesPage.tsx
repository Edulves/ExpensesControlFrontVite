import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import FixedExpenseRow from "../components/fixed-expenses/FixedExpenseRow";
import EditFixedExpenseModal from "../components/fixed-expenses/EditFixedExpenseModal";
import AddFixedExpenseModal from "../components/fixed-expenses/AddFixedExpenseModal";
import { fetchFixedExpenses, updateFixedExpensePaidStatus, deleteFixedExpense, fetchFixedExpensesConsolidation } from "../services/api";
import { getCookie } from "../utils/cookies";
import type { FixedExpense, FixedExpenseStatus } from "../types";

const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export default function FixedExpensesPage() {
    const navigate = useNavigate();
    const now = new Date();

    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notAuthenticated, setNotAuthenticated] = useState(false);

    const fmtAmount = (value: number) => {
        const f = value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        const [i, d] = f.split(',');
        return { i, d };
    };
    const [showAddModal, setShowAddModal] = useState(false);
    const [editing, setEditing] = useState<FixedExpense | null>(null);
    const [consolidation, setConsolidation] = useState<{ paidValue: number; notPaidValue: number } | null>(null);

    const loadFixedExpenses = async (monthToUse: number, yearToUse: number) => {
        const token = getCookie("authToken");

        if (!token) {
            setNotAuthenticated(true);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const items = await fetchFixedExpenses({ month: monthToUse, year: yearToUse });
            setFixedExpenses(items);
            const cons = await fetchFixedExpensesConsolidation(monthToUse, yearToUse);
            setConsolidation(cons);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao carregar despesas fixas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFixedExpenses(month, year);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMonthChange = (value: number) => {
        setMonth(value);
        loadFixedExpenses(value, year);
    };

    const handleYearChange = (value: number) => {
        setYear(value);
        loadFixedExpenses(month, value);
    };

    const handleTogglePaid = async (expense: FixedExpense) => {
        const previous = fixedExpenses;
        const targetStatus: FixedExpenseStatus = expense.status === "paid" ? "unpaid" : "paid";

        // Atualização otimista para feedback imediato.
        setFixedExpenses((prev) => prev.map((e) => (e.id === expense.id ? { ...e, status: targetStatus } : e)));

        try {
            await updateFixedExpensePaidStatus({
                fixedExpensesId: Number(expense.id),
                description: "",
                amount: 0,
                isPaid: targetStatus === "paid",
                fixedExpenseDate: "0001-01-01",
            });
            // Confirma o estado autoritativo vindo do servidor.
            loadFixedExpenses(month, year);
        } catch (err) {
            // Reverte em caso de falha.
            setFixedExpenses(previous);
            setError(err instanceof Error ? err.message : "Erro ao atualizar despesa fixa.");
        }
    };

    const handleEdit = (expense: FixedExpense) => {
        setEditing(expense);
    };

    const handleDelete = async (expense: FixedExpense) => {
        if (!window.confirm(`Excluir "${expense.description}"? Esta ação não pode ser desfeita.`)) return;
        try {
            await deleteFixedExpense(Number(expense.id));
            setFixedExpenses((prev) => prev.filter((e) => e.id !== expense.id));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao excluir despesa fixa.");
        }
    };

    return (
        <AppShell title="Despesas Fixas" subtitle="Gerencie suas contas e assinaturas recorrentes.">
            {/* Filters: Mês e Ano */}
            <div className="flex flex-wrap items-end justify-between gap-3 mb-6 -mt-2">
                <div className="flex flex-wrap items-end gap-3">
                    {/* Month Select */}
                    <div className="space-y-1">
                        <label className="font-label-caps text-xs font-semibold text-on-surface block" htmlFor="fixed-month">
                            Mês
                        </label>
                        <select
                            id="fixed-month"
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
                        <label className="font-label-caps text-xs font-semibold text-on-surface block" htmlFor="fixed-year">
                            Ano
                        </label>
                        <select
                            id="fixed-year"
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

                    {/* Add Fixed Expense Button */}
                    <div className="flex items-end gap-2">
                        <button
                            type="button"
                            onClick={() => setShowAddModal(true)}
                            className="inline-flex items-center gap-2 bg-primary text-on-primary font-label-caps text-xs font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-primary-container transition-colors active:scale-95 duration-200"
                        >
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            Nova Despesa Fixa
                        </button>
                    </div>
                </div>

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-surface-container-lowest p-6 rounded-xl border border-border-subtle flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-on-surface-variant">payments</span>
                        <span className="font-label-caps text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
                            Total Fixo Mensal
                        </span>
                    </div>
                    {(() => {
                        const total = consolidation ? consolidation.paidValue + consolidation.notPaidValue : 0;
                        const { i, d } = fmtAmount(total);
                        return (
                            <div className="font-display-lg text-5xl font-bold text-primary mt-2">
                                <span className="font-label-numeric text-xl font-semibold align-top">R$</span>
                                {i}<span className="font-label-numeric text-xl font-semibold">,{d}</span>
                            </div>
                        );
                    })()}
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl border border-border-subtle flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-positive-emerald">check_circle</span>
                        <span className="font-label-caps text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Pago Este Mês</span>
                    </div>
                    {(() => {
                        const paid = consolidation ? consolidation.paidValue : 0;
                        const total = consolidation ? consolidation.paidValue + consolidation.notPaidValue : 0;
                        const pct = total > 0 ? Math.round((paid / total) * 100) : 0;
                        const { i, d } = fmtAmount(paid);
                        return (
                            <div>
                                <div className="font-display-lg text-5xl font-bold text-on-background mt-2">
                                    <span className="font-label-numeric text-xl font-semibold align-top">R$</span>
                                    {i}<span className="font-label-numeric text-xl font-semibold">,{d}</span>
                                </div>
                                <div className="w-full bg-surface-container-high rounded-full h-1.5 mt-4">
                                    <div className="bg-positive-emerald h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                                </div>
                            </div>
                        );
                    })()}
                </div>

                <div className="bg-surface-container-lowest p-6 rounded-xl border border-border-subtle flex flex-col justify-between">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="material-symbols-outlined text-warning-amber">pending</span>
                        <span className="font-label-caps text-xs font-semibold text-on-surface-variant uppercase tracking-wider">Pendente</span>
                    </div>
                    {(() => {
                        const pend = consolidation ? consolidation.notPaidValue : 0;
                        const { i, d } = fmtAmount(pend);
                        return (
                            <div className="font-display-lg text-5xl font-bold text-on-background mt-2">
                                <span className="font-label-numeric text-xl font-semibold align-top">R$</span>
                                {i}<span className="font-label-numeric text-xl font-semibold">,{d}</span>
                            </div>
                        );
                    })()}
                </div>
            </div>

            {/* Main Content Area: Fixed Expenses List */}
            <div className="bg-surface-container-lowest rounded-xl border border-border-subtle overflow-hidden">
                {/* List Header (Desktop) */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-border-subtle bg-surface-container-low text-on-surface-variant font-label-caps text-xs font-semibold uppercase tracking-wider">
                    <div className="col-span-5 pl-2">Descrição</div>
                    <div className="col-span-2 text-right">Valor</div>
                    <div className="col-span-2 text-center">Status</div>
                    <div className="col-span-2 text-right">Vencimento</div>
                    <div className="col-span-1 text-center">Ação</div>
                </div>

                {/* Loading / Error / Expense Rows */}
                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <div className="flex flex-col items-center gap-3">
                            <span className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                            <p className="font-body-sm text-sm text-on-surface-variant">Carregando despesas fixas...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="bg-negative-rose/10 border border-negative-rose rounded-xl m-4 p-6 text-center">
                        <p className="font-body-lg text-base text-negative-rose mb-1">{error}</p>
                        <button
                            className="bg-primary text-on-primary font-body-lg text-base py-2 px-6 rounded-lg hover:bg-primary-container transition-colors"
                            type="button"
                            onClick={() => loadFixedExpenses(month, year)}
                        >
                            Tentar novamente
                        </button>
                    </div>
                ) : fixedExpenses.length === 0 ? (
                    <p className="font-body-sm text-sm text-on-surface-variant p-6 text-center">Nenhuma despesa fixa encontrada no período.</p>
                ) : (
                    <div className="flex flex-col">
                        {fixedExpenses.map((expense) => (
                            <FixedExpenseRow
                                key={expense.id}
                                expense={expense}
                                onTogglePaid={handleTogglePaid}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>

            <AddFixedExpenseModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSaved={() => loadFixedExpenses(month, year)}
                copyMonth={month}
                copyYear={year}
            />

            <EditFixedExpenseModal
                open={editing !== null}
                expense={editing}
                onClose={() => setEditing(null)}
                onSaved={() => loadFixedExpenses(month, year)}
            />

            {/* Mobile FAB for adding fixed expense */}
            <button
                onClick={() => setShowAddModal(true)}
                className="md:hidden fixed bottom-4 right-4 w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center z-40 active:scale-95 transition-transform"
            >
                <span className="material-symbols-outlined text-[24px]" data-weight="fill">
                    add
                </span>
            </button>

            {/* Not Authenticated Popup */}
            {notAuthenticated && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="w-full max-w-sm bg-surface-container-lowest border border-negative-rose rounded-xl p-6 shadow-lg text-center">
                        <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 bg-negative-rose/10 text-negative-rose">
                            <span className="material-symbols-outlined text-2xl">lock</span>
                        </div>
                        <h2 className="font-display-md text-display-md mb-1 text-negative-rose">Não autenticado</h2>
                        <p className="font-body-lg text-base text-on-surface-variant mb-6">
                            Você não está logado. Faça login para acessar suas despesas fixas.
                        </p>
                        <button
                            className="w-full bg-primary text-on-primary font-body-lg text-base py-2 rounded-lg hover:bg-primary-container transition-colors"
                            type="button"
                            onClick={() => navigate("/login")}
                        >
                            Fazer Login
                        </button>
                    </div>
                </div>
            )}
        </AppShell>
    );
}
