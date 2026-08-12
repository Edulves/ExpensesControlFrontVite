# Expenses Control

Conversão do protótipo em HTML/Tailwind (CDN) para **React + TypeScript + Vite**, com Tailwind CSS via PostCSS (não mais via CDN) e roteamento com **react-router-dom**.

## Telas incluídas

| Rota | Página | Arquivo |
|---|---|---|
| `/login` | Login | `src/pages/LoginPage.tsx` |
| `/dashboard` | Dashboard (resumo, despesas recentes, gráfico de categorias) | `src/pages/DashboardPage.tsx` |
| `/expenses` | Daily Expenses / Expenses Log (tabela + modal de novo lançamento) | `src/pages/DailyExpensesPage.tsx` |
| `/fixed-expenses` | Fixed Expenses (contas fixas, status pago/não pago) | `src/pages/FixedExpensesPage.tsx` |
| `/categories` | Manage Categories | `src/pages/CategoriesPage.tsx` |

`/` redireciona para `/login`. Qualquer rota desconhecida também cai em `/login`.

## Estrutura

```
src/
  components/
    layout/
      AppShell.tsx        # compõe Sidebar + TopNavBar + drawer mobile p/ páginas autenticadas
      Sidebar.tsx          # menu lateral fixo (desktop), com NavLink ativo por rota
      MobileNavDrawer.tsx  # menu lateral em drawer (mobile), aberto pelo botão "menu" do TopNavBar
      TopNavBar.tsx        # barra superior reutilizável (título, subtítulo, busca opcional, avatar)
    ui/
      StatCard.tsx          # card genérico de estatística (usado no Dashboard)
    dashboard/
      RecentExpensesList.tsx
      CategoryDonutChart.tsx
    expenses/
      ExpensesTable.tsx
      QuickStatsPanel.tsx
      AddExpenseModal.tsx   # modal controlado por estado React (useState), não mais manipulação de DOM
    fixed-expenses/
      FixedExpenseRow.tsx
    categories/
      CategoryCard.tsx
  pages/
    LoginPage.tsx
    DashboardPage.tsx
    DailyExpensesPage.tsx
    FixedExpensesPage.tsx
    CategoriesPage.tsx
  data.ts                  # todos os dados mockados (categorias, despesas, contas fixas, etc.)
  types.ts                 # tipos TypeScript compartilhados
  App.tsx                  # BrowserRouter + Routes
  index.css                # diretivas do Tailwind + estilos globais (Material Symbols)
  main.tsx                 # entrypoint do React
tailwind.config.ts          # todos os tokens de cor/spacing/type dos 5 designs originais (idênticos entre eles)
```

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:5173 — a rota inicial (`/`) leva para o Login.

## Build de produção

```bash
npm run build
npm run preview
```

## Decisões de conversão e consistência entre telas

Os 5 arquivos HTML originais (Categories, Dashboard, Fixed Expenses, Daily Expenses, Login) compartilhavam o mesmo `tailwind.config` (cores, spacing, tipografia) mas tinham pequenas inconsistências de marcação entre si (ex.: onde o título da página aparecia, como o CTA "Add Expense" era posicionado no menu, uso de `data-weight="fill"` vs. classes `.icon-filled`/`.filled-icon` para ícones preenchidos). Para manter **um único padrão** em todo o app:

- **`AppShell`** unifica o layout autenticado (Sidebar + TopNavBar + área de conteúdo com `max-w-container-max`) para Dashboard, Daily Expenses, Fixed Expenses e Categories. O Login não usa `AppShell`, pois é uma tela isolada, sem sidebar.
- **`TopNavBar`** agora sempre mostra o título da página (antes, cada tela decidia isso de um jeito diferente); a busca só aparece quando a página faz sentido para ela (`searchPlaceholder`), como em Categories.
- **`Sidebar`** ficou fixa em todas as telas autenticadas, com o botão "Add Expense" sempre no topo (era inconsistente entre os protótipos) e o item ativo calculado pela rota atual via `NavLink`, não mais por classes fixas em cada HTML.
- Ícones preenchidos (`Material Symbols`) usam sempre o atributo `data-weight="fill"`, já estilizado globalmente em `index.css` — substitui as variações `.filled-icon` / `.icon-filled` dos protótipos.
- O modal "New Expense Entry" e o FAB mobile de Daily Expenses, que no HTML original usavam `onclick` + `classList.toggle` no DOM puro, agora são controlados por `useState` (`AddExpenseModal` + `DailyExpensesPage`).
- O login é **mock**: o `onSubmit` do formulário apenas navega para `/dashboard` (não há backend). Ajuste `LoginPage.tsx` quando plugar uma API real de autenticação.
- Todos os dados exibidos (despesas, contas fixas, breakdown de categorias) vêm de `src/data.ts`, prontos para serem substituídos por chamadas de API.
# ExpensesControlFrontVite
