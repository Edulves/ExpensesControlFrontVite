# Expenses Control

Aplicação web para **controle pessoal de despesas**, desenvolvida com React, TypeScript e Vite.

O sistema permite registrar despesas do dia a dia, acompanhar gastos, cadastrar despesas fixas e organizar as categorias utilizadas nos lançamentos.

## Funcionalidades

### Login

Tela de acesso ao sistema.

Atualmente, o login é apenas uma simulação para navegação entre as telas. Não há autenticação real conectada a um servidor.

### Dashboard

Apresenta um resumo das informações financeiras cadastradas, permitindo visualizar:

* Resumo dos gastos.
* Despesas recentes.
* Distribuição das despesas por categoria.
* Informações gerais sobre os lançamentos.

### Despesas

Permite registrar e consultar despesas do dia a dia.

O usuário pode:

* Adicionar uma nova despesa.
* Informar a data, valor, categoria e observação.
* Visualizar os lançamentos cadastrados.
* Consultar informações resumidas sobre as despesas.

### Despesas Fixas

Área destinada ao acompanhamento de contas que se repetem regularmente.

O usuário pode visualizar:

* Contas fixas cadastradas.
* Valor de cada conta.
* Situação da conta, como paga ou não paga.

### Categorias

Permite organizar as categorias utilizadas para classificar as despesas.

As categorias são utilizadas nos lançamentos e também no agrupamento das informações apresentadas no Dashboard.

---

## Estrutura do projeto

```text
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
      CategoryHorizontalBarChart.tsx
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
  config/
    navigation.ts          # itens do menu lateral (metadados de UI, não vêm da API)
  services/
    api.ts                 # cliente HTTP com todos os endpoints consumidos pelo app
  types.ts                 # tipos TypeScript compartilhados
  App.tsx                  # BrowserRouter + Routes
  index.css                # diretivas do Tailwind + estilos globais (Material Symbols)
  main.tsx                 # entrypoint do React
tailwind.config.ts          # todos os tokens de cor/spacing/type dos 5 designs originais (idênticos entre eles)
```

### Organização

**`pages/`**

Contém as páginas principais da aplicação. Cada página representa uma área acessível pelo usuário.

**`components/`**

Contém componentes reutilizáveis separados de acordo com sua finalidade:

* `layout/`: estrutura de navegação e layout.
* `ui/`: componentes visuais genéricos.
* `dashboard/`: componentes específicos do Dashboard.
* `expenses/`: componentes relacionados às despesas.
* `fixed-expenses/`: componentes relacionados às despesas fixas.
* `categories/`: componentes relacionados às categorias.

**`data.ts`**

<<<<<<< Updated upstream
Atualmente contém os dados utilizados pela aplicação durante o desenvolvimento.

Esses dados são mockados e podem posteriormente ser substituídos por informações provenientes da API.

**`types.ts`**

Centraliza os tipos TypeScript compartilhados entre os componentes da aplicação.

**`App.tsx`**

Configura o roteamento da aplicação utilizando `react-router-dom`.

**`index.css`**

Contém os estilos globais e a configuração base do Tailwind CSS.

---

## Rotas

| Rota              | Tela           |
| ----------------- | -------------- |
| `/login`          | Login          |
| `/dashboard`      | Dashboard      |
| `/expenses`       | Despesas       |
| `/fixed-expenses` | Despesas Fixas |
| `/categories`     | Categorias     |

A rota `/` direciona para `/login`.

Rotas inexistentes também direcionam o usuário para `/login`.

---

## Tecnologias

* **React**
* **TypeScript**
* **Vite**
* **Tailwind CSS**
* **PostCSS**
* **react-router-dom**
* **Material Symbols**

O Tailwind CSS é utilizado localmente através do PostCSS, sem dependência do CDN.

---

## Funcionamento atual

A aplicação atualmente funciona utilizando **dados simulados**.

O fluxo principal é:

1. O usuário acessa o sistema.
2. Na tela de login, realiza o acesso.
3. Após o login, é direcionado para o Dashboard.
4. Através do menu lateral, pode acessar despesas, despesas fixas e categorias.
5. Os lançamentos e demais informações são exibidos utilizando os dados disponíveis no projeto.

O formulário de login atualmente não realiza autenticação em um servidor.

As despesas, categorias e despesas fixas também ainda não são persistidas em um banco de dados.

A estrutura do projeto foi organizada para permitir posteriormente a integração com uma API responsável pela autenticação, persistência e consulta dos dados.

---

## Responsividade

A interface foi desenvolvida para funcionar em diferentes tamanhos de tela.

Em telas maiores, a navegação utiliza uma barra lateral fixa.

Em dispositivos menores, a navegação lateral pode ser aberta através do menu mobile.

---
- **`AppShell`** unifica o layout autenticado (Sidebar + TopNavBar + área de conteúdo com `max-w-container-max`) para Dashboard, Daily Expenses, Fixed Expenses e Categories. O Login não usa `AppShell`, pois é uma tela isolada, sem sidebar.
- **`TopNavBar`** agora sempre mostra o título da página (antes, cada tela decidia isso de um jeito diferente); a busca só aparece quando a página faz sentido para ela (`searchPlaceholder`), como em Categories.
- **`Sidebar`** ficou fixa em todas as telas autenticadas, com o botão "Add Expense" sempre no topo (era inconsistente entre os protótipos) e o item ativo calculado pela rota atual via `NavLink`, não mais por classes fixas em cada HTML.
- Ícones preenchidos (`Material Symbols`) usam sempre o atributo `data-weight="fill"`, já estilizado globalmente em `index.css` — substitui as variações `.filled-icon` / `.icon-filled` dos protótipos.
- O modal "New Expense Entry" e o FAB mobile de Daily Expenses, que no HTML original usavam `onclick` + `classList.toggle` no DOM puro, agora são controlados por `useState` (`AddExpenseModal` + `DailyExpensesPage`).
- O login usa a API real (`POST /api/Auth/login`), armazenando `authToken` e `tokenExpiration` em cookies e redirecionando para `/dashboard` em caso de sucesso.
- Todos os dados exibidos (despesas, contas fixas, breakdown de categorias, categorias de transação) vêm da API através de `src/services/api.ts`. Não há mais dados mockados de negócio no projeto; apenas `src/config/navigation.ts` mantém a configuração estática do menu lateral, que é acoplada às rotas do React Router.
