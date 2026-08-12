import type { Expense } from "../types";
import { getCookie } from "../utils/cookies";

const API_BASE_URL = "https://localhost:7280";

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
    "bg-outline",
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
        const wrapped =
            data.value ||
            data.items ||
            data.data ||
            data.expensesPerCategory ||
            data.$values;

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
