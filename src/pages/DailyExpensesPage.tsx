import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import ExpensesTable from "../components/expenses/ExpensesTable";
import QuickStatsPanel from "../components/expenses/QuickStatsPanel";
import AddExpenseModal from "../components/expenses/AddExpenseModal";
import EditExpenseModal from "../components/expenses/EditExpenseModal";
import {
    fetchDailyExpenses,
    fetchExpensesPerCategory,
    deleteDailyExpense,
    fetchTransactionCategories,
    type ExpenseByCategory,
    type TransactionCategory,
} from "../services/api";
import { getCookie } from "../utils/cookies";
import type { Expense } from "../types";

const MONTHS = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export default function DailyExpensesPage() {
    const navigate = useNavigate();
    const now = new Date();
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState<Expense | null>(null);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notAuthenticated, setNotAuthenticated] = useState(false);
    const [topCategories, setTopCategories] = useState<ExpenseByCategory[]>([]);
    const [totalToday, setTotalToday] = useState(0);
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const [beginningOfPeriod, setBeginningOfPeriod] = useState("");
    const [endOfPeriod, setEndOfPeriod] = useState("");
    const [category, setCategory] = useState("");
    const [note, setNote] = useState("");
    const [categoryOptions, setCategoryOptions] = useState<TransactionCategory[]>([]);
    const [categoryOptionsError, setCategoryOptionsError] = useState<string | null>(null);

    // Filtros "aplicados" — só são atualizados ao clicar em Apply
    const [appliedMonth, setAppliedMonth] = useState(now.getMonth() + 1);
    const [appliedYear, setAppliedYear] = useState(now.getFullYear());
    const [appliedBeginningOfPeriod, setAppliedBeginningOfPeriod] = useState("");
    const [appliedEndOfPeriod, setAppliedEndOfPeriod] = useState("");
    const [appliedCategory, setAppliedCategory] = useState("");
    const [appliedNote, setAppliedNote] = useState("");

    // Controla a visibilidade dos filtros avançados (De, Até, Observação).
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [advancedError, setAdvancedError] = useState<string | null>(null);

    const [page, setPage] = useState(1);
    const [qty, setQty] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const dateFilters = {
                month: appliedMonth,
                year: appliedYear,
                beginningOfPeriod: appliedBeginningOfPeriod,
                endOfPeriod: appliedEndOfPeriod,
            };
            const [expenseResponse, categoryData] = await Promise.all([
                fetchDailyExpenses({
                    ...dateFilters,
                    category: appliedCategory,
                    note: appliedNote,
                    page,
                    qty,
                }),
                fetchExpensesPerCategory(dateFilters),
            ]);
            setExpenses(expenseResponse.items);
            setTotalPages(expenseResponse.totalPages);
            setTotalItems(expenseResponse.totalItems);
            setTopCategories(categoryData.categories);
            setTotalToday(categoryData.total);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao carregar despesas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            const token = getCookie("authToken");

            if (!token) {
                setNotAuthenticated(true);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const dateFilters = {
                    month: appliedMonth,
                    year: appliedYear,
                    beginningOfPeriod: appliedBeginningOfPeriod,
                    endOfPeriod: appliedEndOfPeriod,
                };
                const [expenseResponse, categoryData] = await Promise.all([
                    fetchDailyExpenses({
                        ...dateFilters,
                        category: appliedCategory,
                        note: appliedNote,
                        page,
                        qty,
                    }),
                    fetchExpensesPerCategory(dateFilters),
                ]);
                if (!cancelled) {
                    setExpenses(expenseResponse.items);
                    setTotalPages(expenseResponse.totalPages);
                    setTotalItems(expenseResponse.totalItems);
                    setTopCategories(categoryData.categories);
                    setTotalToday(categoryData.total);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : "Erro ao carregar despesas.");
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        load();

        return () => {
            cancelled = true;
        };
    }, [appliedMonth, appliedYear, appliedBeginningOfPeriod, appliedEndOfPeriod, appliedCategory, appliedNote, page, qty]);

    // Carrega as categorias de transação a partir da API (uma única vez).
    // Usadas para popular o filtro "Categoria". Se falhar, o select fica só
    // com "Todas as categorias" e mostra uma mensagem discreta.
    useEffect(() => {
        let cancelled = false;
        const token = getCookie("authToken");
        if (!token) return;

        (async () => {
            try {
                const items = await fetchTransactionCategories();
                if (!cancelled) {
                    setCategoryOptions(items);
                    setCategoryOptionsError(null);
                }
            } catch (err) {
                if (!cancelled) {
                    setCategoryOptionsError(err instanceof Error ? err.message : "Erro ao carregar categorias.");
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    // Filtros imediatos (Mês, Ano, Categoria) — aplicados assim que o campo muda.
    const handleMonthChange = (value: number) => {
        setMonth(value);
        setAppliedMonth(value);
        setPage(1);
    };

    const handleYearChange = (value: number) => {
        setYear(value);
        setAppliedYear(value);
        setPage(1);
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
        setAppliedCategory(value);
        setPage(1);
    };

    // Aplica os filtros avançados (De, Até, Observação) — somente via botão "Aplicar".
    // Regra: "De" e "Até" precisam ser preenchidos em conjunto (ou nenhum dos dois).
    const handleApplyAdvanced = () => {
        const hasStart = Boolean(beginningOfPeriod);
        const hasEnd = Boolean(endOfPeriod);

        if (hasStart !== hasEnd) {
            setAdvancedError('Os filtros "De" e "Até" devem ser preenchidos em conjunto.');
            return;
        }

        setAdvancedError(null);
        setAppliedBeginningOfPeriod(beginningOfPeriod);
        setAppliedEndOfPeriod(endOfPeriod);
        setAppliedNote(note);
        setPage(1);
    };

    const handleEdit = (expense: Expense) => {
        setEditing(expense);
    };

    const handleDelete = async (expense: Expense) => {
        if (!window.confirm("Excluir esta despesa?")) return;
        try {
            await deleteDailyExpense(Number(expense.id));
            setPage(1);
            loadData();
        } catch (err) {
            window.alert(err instanceof Error ? err.message : "Erro ao excluir despesa.");
        }
    };

    return (
        <AppShell title="Despesas Diárias" subtitle="Revise e gerencie suas transações do dia a dia.">
            {/* Filters */}
            <div className="flex flex-wrap items-end justify-between gap-3 mb-6 -mt-2">
                <div className="flex flex-wrap items-end gap-3">
                    {/* Month Select — applied immediately */}
                    <div className="space-y-1">
                        <label className="font-label-caps text-xs font-semibold text-on-surface block" htmlFor="month-filter">
                            Mês
                        </label>
                        <select
                            id="month-filter"
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

                    {/* Year Select — applied immediately */}
                    <div className="space-y-1">
                        <label className="font-label-caps text-xs font-semibold text-on-surface block" htmlFor="year-filter">
                            Ano
                        </label>
                        <select
                            id="year-filter"
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

                    {/* Category Select — applied immediately */}
                    <div className="space-y-1">
                        <label className="font-label-caps text-xs font-semibold text-on-surface block" htmlFor="category-filter">
                            Categoria
                        </label>
                        <select
                            id="category-filter"
                            className="bg-surface-container-lowest border border-border-subtle rounded-lg px-3 py-2 font-body-lg text-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            value={category}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                        >
                            <option value="">Todas as categorias</option>
                            {categoryOptions.map((c) => (
                                <option key={c.transactionCategoryId} value={c.name}>
                                    {c.name.charAt(0).toUpperCase() + c.name.slice(1)}
                                </option>
                            ))}
                        </select>
                        {categoryOptionsError && <p className="font-label-caps text-xs text-negative-rose mt-1">{categoryOptionsError}</p>}
                    </div>

                    {/* Advanced filters toggle */}
                    <div className="space-y-1">
                        <button
                            type="button"
                            onClick={() => setShowAdvanced((v) => !v)}
                            aria-expanded={showAdvanced}
                            className="inline-flex items-center gap-1 bg-surface-container-lowest border border-border-subtle rounded-lg px-3 py-2 font-label-caps text-xs font-semibold text-on-surface hover:border-primary hover:text-primary transition-colors"
                        >
                            <span className="material-symbols-outlined text-[16px]">tune</span>
                            Filtros avançados
                            <span className="material-symbols-outlined text-[16px]">{showAdvanced ? "expand_less" : "expand_more"}</span>
                        </button>
                    </div>
                </div>

                <div className="flex">
                    <button
                        onClick={() => setModalOpen(true)}
                        className="hidden md:flex bg-primary text-on-primary rounded-lg py-1 px-4 items-center justify-center gap-2 hover:bg-primary-container transition-colors shadow-sm font-label-caps text-xs font-semibold"
                    >
                        <span className="material-symbols-outlined" data-weight="fill">
                            add
                        </span>
                        Nova despesa
                    </button>
                </div>
            </div>

            {/* Advanced filters (hidden by default) — applied only on "Aplicar" */}
            {showAdvanced && (
                <div className="mb-6 -mt-2 p-4 bg-surface-container-lowest border border-border-subtle rounded-xl space-y-3">
                    <h3 className="font-label-caps text-xs font-semibold text-on-surface-variant">Filtros avançados</h3>
                    <div className="flex flex-wrap items-end gap-3">
                        {/* Beginning of Period */}
                        <div className="space-y-1">
                            <label className="font-label-caps text-xs font-semibold text-on-surface block" htmlFor="begin-filter">
                                De
                            </label>
                            <input
                                id="begin-filter"
                                type="date"
                                value={beginningOfPeriod}
                                onChange={(e) => setBeginningOfPeriod(e.target.value)}
                                className="bg-surface-container-lowest border border-border-subtle rounded-lg px-3 py-2 font-body-lg text-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            />
                        </div>

                        {/* End of Period */}
                        <div className="space-y-1">
                            <label className="font-label-caps text-xs font-semibold text-on-surface block" htmlFor="end-filter">
                                Até
                            </label>
                            <input
                                id="end-filter"
                                type="date"
                                value={endOfPeriod}
                                onChange={(e) => setEndOfPeriod(e.target.value)}
                                className="bg-surface-container-lowest border border-border-subtle rounded-lg px-3 py-2 font-body-lg text-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            />
                        </div>

                        {/* Note Input */}
                        <div className="space-y-1">
                            <label className="font-label-caps text-xs font-semibold text-on-surface block" htmlFor="note-filter">
                                Observação
                            </label>
                            <input
                                id="note-filter"
                                type="text"
                                placeholder="Buscar observação..."
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                className="bg-surface-container-lowest border border-border-subtle rounded-lg px-3 py-2 font-body-lg text-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            />
                        </div>

                        {/* Apply Advanced Button */}
                        <button
                            type="button"
                            onClick={handleApplyAdvanced}
                            className="bg-primary text-on-primary rounded-lg py-2 px-4 items-center justify-center gap-2 hover:bg-primary-container transition-colors shadow-sm font-label-caps text-xs font-semibold"
                        >
                            Aplicar
                        </button>
                    </div>
                    {advancedError && <p className="font-label-caps text-xs text-negative-rose">{advancedError}</p>}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-16">
                    <div className="flex flex-col items-center gap-3">
                        <span className="inline-block w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="font-body-sm text-sm text-on-surface-variant">Carregando despesas...</p>
                    </div>
                </div>
            ) : error ? (
                <div className="bg-negative-rose/10 border border-negative-rose rounded-xl p-6 text-center">
                    <p className="font-body-lg text-base text-negative-rose mb-1">{error}</p>
                    <button
                        className="bg-primary text-on-primary font-body-lg text-base py-2 px-6 rounded-lg hover:bg-primary-container transition-colors"
                        type="button"
                        onClick={() => loadData()}
                    >
                        Tentar novamente
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <ExpensesTable expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />
                    <QuickStatsPanel totalToday={totalToday} topCategories={topCategories} />
                    {/* Paginação: na versão responsiva fica logo abaixo da tabela (e não como último
                        elemento da página); no desktop ocupa a linha inteira na base do grid. */}
                    <div className="order-1 lg:order-2 lg:col-span-3 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <label className="font-label-caps text-xs font-semibold text-on-surface-variant" htmlFor="qty-filter">
                                Linhas por página
                            </label>
                            <select
                                id="qty-filter"
                                className="bg-surface-container-lowest border border-border-subtle rounded-lg px-2 py-1.5 font-body-sm text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                                value={qty}
                                onChange={(e) => {
                                    setQty(Number(e.target.value));
                                    setPage(1);
                                }}
                            >
                                {[5, 10, 25, 50, 100].map((n) => (
                                    <option key={n} value={n}>
                                        {n}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="px-3 py-1.5 rounded-lg border border-border-subtle font-label-caps text-xs font-semibold text-primary hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Anterior
                            </button>
                            <span className="font-label-caps text-xs font-semibold text-on-surface-variant">
                                Página {page} de {Math.max(1, totalPages)} · {totalItems} item(ns)
                            </span>
                            <button
                                type="button"
                                disabled={page >= totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                className="px-3 py-1.5 rounded-lg border border-border-subtle font-label-caps text-xs font-semibold text-primary hover:bg-surface-container-low transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <AddExpenseModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSaved={() => {
                    setPage(1);
                    loadData();
                }}
            />
            <EditExpenseModal
                open={editing !== null}
                expense={editing}
                onClose={() => setEditing(null)}
                onSaved={() => {
                    setPage(1);
                    loadData();
                }}
            />

            {/* Mobile FAB for adding expense */}
            <button
                onClick={() => setModalOpen(true)}
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
                            Você não está logado. Faça login para acessar suas despesas.
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
