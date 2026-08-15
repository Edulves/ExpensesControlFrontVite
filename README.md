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
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx
│   │   ├── Sidebar.tsx
│   │   ├── MobileNavDrawer.tsx
│   │   └── TopNavBar.tsx
│   │
│   ├── ui/
│   │   └── StatCard.tsx
│   │
│   ├── dashboard/
│   │   ├── RecentExpensesList.tsx
│   │   └── CategoryDonutChart.tsx
│   │
│   ├── expenses/
│   │   ├── ExpensesTable.tsx
│   │   ├── QuickStatsPanel.tsx
│   │   └── AddExpenseModal.tsx
│   │
│   ├── fixed-expenses/
│   │   └── FixedExpenseRow.tsx
│   │
│   └── categories/
│       └── CategoryCard.tsx
│
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── DailyExpensesPage.tsx
│   ├── FixedExpensesPage.tsx
│   └── CategoriesPage.tsx
│
├── data.ts
├── types.ts
├── App.tsx
├── index.css
└── main.tsx

tailwind.config.ts
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
