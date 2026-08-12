import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppShell from "../components/layout/AppShell";
import ExpensesTable from "../components/expenses/ExpensesTable";
import QuickStatsPanel from "../components/expenses/QuickStatsPanel";
import AddExpenseModal from "../components/expenses/AddExpenseModal";
import { fetchDailyExpenses, fetchExpensesPerCategory, type ExpenseByCategory } from "../services/api";
import { getCookie } from "../utils/cookies";
import type { Expense } from "../types";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function DailyExpensesPage() {
    const navigate = useNavigate();
    const now = new Date();
    const [modalOpen, setModalOpen] = useState(false);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notAuthenticated, setNotAuthenticated] = useState(false);
    const [topCategories, setTopCategories] = useState<ExpenseByCategory[]>([]);
    const [totalToday, setTotalToday] = useState(0);
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());

    const loadData = async () => {
        try {
            setLoading(true);
            setError(null);
            const [data, categoryData] = await Promise.all([
                fetchDailyExpenses({ month, year }),
                fetchExpensesPerCategory(month, year),
            ]);
            setExpenses(data);
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
                const [data, categoryData] = await Promise.all([
                    fetchDailyExpenses({ month, year }),
                    fetchExpensesPerCategory(month, year),
                ]);
                if (!cancelled) {
                    setExpenses(data);
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
    }, [month, year]);

    const handleApplyFilters = () => {
        loadData();
    };

    return (
        <AppShell title="Daily Expenses" subtitle="Review and manage your day-to-day transactions.">
            {/* Filters */}
            <div className="flex flex-wrap items-end justify-between gap-3 mb-6 -mt-2">
                <div className="flex flex-wrap items-end gap-3">
                    {/* Month Select */}
                    <div className="space-y-1">
                        <label className="font-label-caps text-xs font-semibold text-on-surface block" htmlFor="month-filter">
                            Month
                        </label>
                        <select
                            id="month-filter"
                            className="bg-surface-container-lowest border border-border-subtle rounded-lg px-3 py-2 font-body-lg text-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
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
                        <label className="font-label-caps text-xs font-semibold text-on-surface block" htmlFor="year-filter">
                            Year
                        </label>
                        <select
                            id="year-filter"
                            className="bg-surface-container-lowest border border-border-subtle rounded-lg px-3 py-2 font-body-lg text-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                        >
                            {Array.from({ length: 10 }, (_, i) => now.getFullYear() - 5 + i).map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Apply Button */}
                    <button
                        onClick={handleApplyFilters}
                        className="bg-primary text-on-primary rounded-lg py-2 px-4 items-center justify-center gap-2 hover:bg-primary-container transition-colors shadow-sm font-label-caps text-xs font-semibold"
                    >
                        Apply
                    </button>
                </div>

                <div className="flex gap-3">
                    <button className="hidden md:flex bg-surface-container-lowest border border-border-subtle text-primary rounded-lg py-1 px-4 items-center justify-center gap-2 hover:bg-surface-container-low transition-colors font-label-caps text-xs font-semibold">
                        <span className="material-symbols-outlined text-[18px]">filter_list</span>
                        Filter
                    </button>
                    <button
                        onClick={() => setModalOpen(true)}
                        className="hidden md:flex bg-primary text-on-primary rounded-lg py-1 px-4 items-center justify-center gap-2 hover:bg-primary-container transition-colors shadow-sm font-label-caps text-xs font-semibold"
                    >
                        <span className="material-symbols-outlined" data-weight="fill">
                            add
                        </span>
                        New Entry
                    </button>
                </div>
            </div>

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
                    <ExpensesTable expenses={expenses} />
                    <QuickStatsPanel totalToday={totalToday} topCategories={topCategories} />
                </div>
            )}

            <AddExpenseModal open={modalOpen} onClose={() => setModalOpen(false)} />

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
