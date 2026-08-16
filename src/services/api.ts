import type { Expense } from "../types";
import { getCookie } from "../utils/cookies";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/";

export interface DailyExpenseResponse {
    dailyExpenseId: number;
    expenseDate: string;
    expenseValue: number;
    note: string;
    categoryName: string;
    userId: string;
}

export interface DailyExpenseFilters {
    month: number;
    year: number;
    beginningOfPeriod?: string;
    endOfPeriod?: string;
    category?: string;
    note?: string;
    page?: number;
    qty?: number;
}

export interface PagedExpenses {
    items: Expense[];
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
}

export async function fetchDailyExpenses(filters: DailyExpenseFilters): Promise<PagedExpenses> {
    const token = getCookie("authToken");

    if (!token) {
        throw new Error("Token de autenticação não encontrado. Faça login novamente.");
    }

    // Quando um período completo (início e fim) é informado, o filtro isolado de
    // Mês/Ano é desconsiderado (o backend aplicaria ambos combinados com AND).
    const hasPeriod = Boolean(filters.beginningOfPeriod) && Boolean(filters.endOfPeriod);

    const params = new URLSearchParams();

    if (hasPeriod) {
        params.set("BeginningOfPeriod", filters.beginningOfPeriod!);
        params.set("EndOfPeriod", filters.endOfPeriod!);
    } else {
        params.set("Month", String(filters.month || 0));
        params.set("Year", String(filters.year || 0));
        params.set("BeginningOfPeriod", filters.beginningOfPeriod ?? "");
        params.set("EndOfPeriod", filters.endOfPeriod ?? "");
    }

    params.set("Category", filters.category ?? "");
    params.set("Note", filters.note ?? "");
    params.set("Page", String(filters.page ?? 1));
    params.set("QTY", String(filters.qty ?? 10));

    const url = `${API_BASE_URL}/DailyExpenses?${params.toString()}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Falha ao buscar despesas (status ${response.status})`);
    }

    const data = await response.json();

    // PagedResult<T>: { items, currentPage, itemsPerPage, totalItems, totalPages }.
    // Também tolera retorno como array direto (sem metadados de paginação).
    const rawItems: DailyExpenseResponse[] = Array.isArray(data) ? data : data.items || data.data || data.expenses || [];

    const items: Expense[] = rawItems.map((item) => ({
        id: String(item.dailyExpenseId),
        description: item.note,
        categoryId: item.categoryName,
        categoryLabel: item.categoryName,
        date: item.expenseDate,
        amount: item.expenseValue,
        icon: "receipt_long",
        accentColor: "neutral",
    }));

    return {
        items,
        currentPage: data.currentPage ?? filters.page ?? 1,
        itemsPerPage: data.itemsPerPage ?? filters.qty ?? 10,
        totalItems: data.totalItems ?? items.length,
        totalPages: data.totalPages ?? 1,
    };
}

export interface ExpenseByCategory {
    categoryId: string;
    label: string;
    amount: number;
    color: string;
}

interface ExpensesPerCategoryResponse {
    dailyExpensesByCategoryList: {
        categoryName: string;
        expenseValue: number;
    }[];
    total: number;
}

const CATEGORY_COLORS = [
    "bg-secondary-fixed-dim",
    "bg-warning-amber",
    "bg-negative-rose",
    "bg-tertiary-fixed-dim",
    "bg-positive-emerald",
    "bg-surface-tint",
    "bg-inverse-primary",
    "bg-secondary-fixed",
    "bg-outline",
    "bg-on-primary-container",
];

export async function fetchExpensesPerCategory(filters: {
    month: number;
    year: number;
    beginningOfPeriod?: string;
    endOfPeriod?: string;
}): Promise<{ categories: ExpenseByCategory[]; total: number }> {
    const token = getCookie("authToken");

    if (!token) {
        throw new Error("Token de autenticação não encontrado. Faça login novamente.");
    }

    // Mesma regra do fetchDailyExpenses: período completo desconsidera Mês/Ano.
    const hasPeriod = Boolean(filters.beginningOfPeriod) && Boolean(filters.endOfPeriod);

    const params = new URLSearchParams();

    if (hasPeriod) {
        params.set("BeginningOfPeriod", filters.beginningOfPeriod!);
        params.set("EndOfPeriod", filters.endOfPeriod!);
    } else {
        params.set("Month", String(filters.month || 0));
        params.set("Year", String(filters.year || 0));
        params.set("BeginningOfPeriod", "");
        params.set("EndOfPeriod", "");
    }

    const url = `${API_BASE_URL}/DataConsolidation/ExpensesPerCategory?${params.toString()}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Falha ao buscar despesas por categoria (status ${response.status})`);
    }

    const data = await response.json();

    // A API retorna UM objeto { dailyExpensesByCategoryList, total } (não um array,
    // apesar do exemplo da documentação). Normalizamos para uma lista de "grupos",
    // suportando também envelopes comuns caso o retorno mude no futuro.
    let groups: ExpensesPerCategoryResponse[];

    if (Array.isArray(data)) {
        groups = data;
    } else {
        // Envelopes possíveis quando a lista vem embrulhada
        const wrapped = data.value || data.items || data.data || data.expensesPerCategory || data.$values;

        groups = Array.isArray(wrapped) ? wrapped : [data as ExpensesPerCategoryResponse];
    }

    const categories = groups.flatMap((group) => group.dailyExpensesByCategoryList || []);

    // Total consolidado retornado pelo endpoint (soma dos "total" de cada grupo)
    const total = groups.reduce((sum, group) => sum + (group.total || 0), 0);

    return {
        total,
        categories: categories.map((category, index) => ({
            categoryId: category.categoryName,
            label: category.categoryName,
            amount: category.expenseValue,
            color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
        })),
    };
}

export async function fetchTotalDailyExpenses(filters: {
    month: number;
    year: number;
    beginningOfPeriod?: string;
    endOfPeriod?: string;
}): Promise<number> {
    const token = getCookie("authToken");

    if (!token) {
        throw new Error("Token de autenticação não encontrado. Faça login novamente.");
    }

    // Mesma regra dos demais endpoints: período completo desconsidera Mês/Ano.
    const hasPeriod = Boolean(filters.beginningOfPeriod) && Boolean(filters.endOfPeriod);

    const params = new URLSearchParams();

    if (hasPeriod) {
        params.set("BeginningOfPeriod", filters.beginningOfPeriod!);
        params.set("EndOfPeriod", filters.endOfPeriod!);
    } else {
        params.set("Month", String(filters.month || 0));
        params.set("Year", String(filters.year || 0));
        params.set("BeginningOfPeriod", "");
        params.set("EndOfPeriod", "");
    }

    const url = `${API_BASE_URL}/DataConsolidation/TotalDailyExpenses?${params.toString()}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Falha ao buscar total de despesas (status ${response.status})`);
    }

    const data = await response.json();

    // Normaliza o retorno, que pode vir como número direto ou embrulhado em
    // objeto com campos comuns (total / totalValue / value / amount).
    if (typeof data === "number") return data;

    if (data && typeof data === "object") {
        const candidate = data.totalExpenses ?? data.total ?? data.totalValue ?? data.value ?? data.amount;
        const num = Number(candidate);
        if (!Number.isNaN(num)) return num;
    }

    return 0;
}

export interface FixedExpenseApiItem {
    fixedExpenseId: number;
    description: string;
    amount: number;
    isPaid: boolean;
    fixedExpenseDate: string;
    userId: string;
    isDeleted?: boolean;
    createdAt?: string;
}

export interface FixedExpenseFilters {
    month: number;
    year: number;
    beginningOfPeriod?: string;
    endOfPeriod?: string;
    expenseDescription?: string;
    page?: number;
    qty?: number;
}

export async function fetchFixedExpenses(filters: FixedExpenseFilters): Promise<import("../types").FixedExpense[]> {
    const token = getCookie("authToken");

    if (!token) {
        throw new Error("Token de autenticação não encontrado. Faça login novamente.");
    }

    const hasPeriod = Boolean(filters.beginningOfPeriod) && Boolean(filters.endOfPeriod);

    const params = new URLSearchParams();

    if (hasPeriod) {
        params.set("BeginningOfPeriod", filters.beginningOfPeriod!);
        params.set("EndOfPeriod", filters.endOfPeriod!);
    } else {
        params.set("Month", String(filters.month || 0));
        params.set("Year", String(filters.year || 0));
        params.set("BeginningOfPeriod", "");
        params.set("EndOfPeriod", "");
    }

    params.set("ExpenseDescription", filters.expenseDescription ?? "");
    params.set("Page", String(filters.page ?? 1));
    params.set("QTY", String(filters.qty ?? 100));

    const url = `${API_BASE_URL}/FixedExpenses?${params.toString()}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Falha ao buscar despesas fixas (status ${response.status})`);
    }

    const data = await response.json();

    // Tolerante a array direto ou retorno paginado (items/data/fixedExpenses).
    const rawItems: FixedExpenseApiItem[] = Array.isArray(data) ? data : data.items || data.data || data.fixedExpenses || [];

    return rawItems
        .filter((item) => !item.isDeleted)
        .map((item) => ({
            id: String(item.fixedExpenseId),
            description: item.description,
            tags: [] as string[],
            amount: item.amount,
            status: item.isPaid ? ("paid" as const) : ("unpaid" as const),
            dueDate: item.fixedExpenseDate ? item.fixedExpenseDate.slice(0, 10).split("-").reverse().join("/") : "",
            icon: "receipt_long",
            urgent: !item.isPaid,
        }));
}

export interface TransactionCategory {
    transactionCategoryId: number;
    name: string;
}

export interface CreateDailyExpenseEntry {
    expenseDate: string;
    amount: number;
    note?: string | null;
    categoryId: number;
}

export async function fetchTransactionCategories(): Promise<TransactionCategory[]> {
    const token = getCookie("authToken");

    if (!token) {
        throw new Error("Token de autenticação não encontrado. Faça login novamente.");
    }

    const response = await fetch(`${API_BASE_URL}/TransactionCategories`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Falha ao buscar categorias (status ${response.status})`);
    }

    const data = await response.json();
    const items = Array.isArray(data) ? data : data.items || data.data || data.categories || [];

    return (items as { transactionCategoryId?: number; id?: number; name: string }[]).map((item) => ({
        transactionCategoryId: item.transactionCategoryId ?? (item.id as number) ?? 0,
        name: item.name,
    }));
}

export async function createDailyExpenses(entries: CreateDailyExpenseEntry[]): Promise<void> {
    const token = getCookie("authToken");

    if (!token) {
        throw new Error("Token de autenticação não encontrado. Faça login novamente.");
    }

    const response = await fetch(`${API_BASE_URL}/DailyExpenses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(entries),
    });

    if (!response.ok) {
        let detail = `Falha ao salvar despesas (status ${response.status})`;
        try {
            const errorData = await response.json();
            detail = errorData?.detail || errorData?.title || detail;
        } catch {
            // corpo não-JSON; mantém a mensagem padrão
        }
        throw new Error(detail);
    }
}

export interface UpdateDailyExpenseEntry {
    dailyExpenseId: number;
    expenseDate: string;
    expenseValue: number;
    note?: string;
    categoryId: number;
}

export async function updateDailyExpenses(entries: UpdateDailyExpenseEntry[]): Promise<void> {
    const token = getCookie("authToken");

    if (!token) {
        throw new Error("Token de autenticação não encontrado. Faça login novamente.");
    }

    const response = await fetch(`${API_BASE_URL}/DailyExpenses`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(entries),
    });

    if (!response.ok) {
        let detail = `Falha ao atualizar despesas (status ${response.status})`;
        try {
            const errorData = await response.json();
            detail = errorData?.detail || errorData?.title || detail;
        } catch {
            // corpo não-JSON; mantém a mensagem padrão
        }
        throw new Error(detail);
    }
}

export async function deleteDailyExpense(id: number): Promise<void> {
    const token = getCookie("authToken");

    if (!token) {
        throw new Error("Token de autenticação não encontrado. Faça login novamente.");
    }

    const response = await fetch(`${API_BASE_URL}/DailyExpenses/${id}?request=${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        let detail = `Falha ao excluir despesa (status ${response.status})`;
        try {
            const errorData = await response.json();
            detail = errorData?.detail || errorData?.title || detail;
        } catch {
            // corpo não-JSON; mantém a mensagem padrão
        }
        throw new Error(detail);
    }
}

// --- Fixed Expenses (PUT: toggle de pagamento) ---------------------------------

export interface CreateFixedExpenseEntry {
    description: string;
    amount: number;
    fixedExpenseDate: string;
}

export interface UpdateFixedExpenseEntry {
    fixedExpensesId: number;
    description: string;
    amount: number;
    isPaid: boolean;
    fixedExpenseDate: string;
}

// Atualiza o estado de pagamento (isPaid) de uma despesa fixa via PUT.
// O endpoint aceita um array com um único objeto e preserva os demais campos
// quando eles vêm "neutros": descrição vazia (string.IsNullOrEmpty -> mantém),
// amount <= 0 (mantém) e fixedExpenseDate == DateOnly.MinValue -> mantém.
export async function updateFixedExpensePaidStatus(entry: UpdateFixedExpenseEntry): Promise<void> {
    const token = getCookie("authToken");

    if (!token) {
        throw new Error("Token de autenticação não encontrado. Faça login novamente.");
    }

    const response = await fetch(`${API_BASE_URL}/FixedExpenses`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify([entry]),
    });

    if (!response.ok) {
        let detail = `Falha ao atualizar despesa fixa (status ${response.status})`;
        try {
            const errorData = await response.json();
            detail = errorData?.detail || errorData?.title || detail;
        } catch {
            // corpo não-JSON; mantém a mensagem padrão
        }
        throw new Error(detail);
    }
}

// PUT genérico para /FixedExpenses — usado pelo modal de edição (permite
// alterar descrição, valor, status e data simultaneamente).
export async function updateFixedExpenses(entries: UpdateFixedExpenseEntry[]): Promise<void> {
    const token = getCookie("authToken");

    if (!token) {
        throw new Error("Token de autenticação não encontrado. Faça login novamente.");
    }

    const response = await fetch(`${API_BASE_URL}/FixedExpenses`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(entries),
    });

    if (!response.ok) {
        let detail = `Falha ao atualizar despesa fixa (status ${response.status})`;
        try {
            const errorData = await response.json();
            detail = errorData?.detail || errorData?.title || detail;
        } catch {
            // corpo não-JSON; mantém a mensagem padrão
        }
        throw new Error(detail);
    }
}

// POST /FixedExpenses — cria uma ou mais despesas fixas.
export async function createFixedExpenses(entries: CreateFixedExpenseEntry[]): Promise<void> {
    const token = getCookie("authToken");

    if (!token) {
        throw new Error("Token de autenticação não encontrado. Faça login novamente.");
    }

    const response = await fetch(`${API_BASE_URL}/FixedExpenses`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(entries),
    });

    if (!response.ok) {
        let detail = `Falha ao criar despesas fixas (status ${response.status})`;
        try {
            const errorData = await response.json();
            detail = errorData?.detail || errorData?.title || detail;
        } catch {
            // corpo não-JSON; mantém a mensagem padrão
        }
        throw new Error(detail);
    }
}

// DELETE /FixedExpenses/{id} — exclui uma despesa fixa.
export async function deleteFixedExpense(id: number): Promise<void> {
    const token = getCookie("authToken");

    if (!token) {
        throw new Error("Token de autenticação não encontrado. Faça login novamente.");
    }

    const response = await fetch(`${API_BASE_URL}/FixedExpenses/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        let detail = `Falha ao excluir despesa fixa (status ${response.status})`;
        try {
            const errorData = await response.json();
            detail = errorData?.detail || errorData?.title || detail;
        } catch {
            // corpo não-JSON; mantém a mensagem padrão
        }
        throw new Error(detail);
    }
}

// --- Consolidação de despesas fixas ------------------------------------------

// GET /DataConsolidation/FixedExpenses?Month=...&Year=...
// Retorna { paidValue, notPaidValue } para o mês/ano informado.
export async function fetchFixedExpensesConsolidation(month: number, year: number): Promise<{ paidValue: number; notPaidValue: number }> {
    const token = getCookie("authToken");

    if (!token) {
        throw new Error("Token de autenticação não encontrado. Faça login novamente.");
    }

    const url = `${API_BASE_URL}/DataConsolidation/FixedExpenses?Month=${month}&Year=${year}`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Falha ao buscar consolidação de despesas fixas (status ${response.status})`);
    }

    return response.json();
}
