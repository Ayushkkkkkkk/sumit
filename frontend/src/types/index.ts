export type User = {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
};

export type AuthResponse = {
  token: string;
  user: User;
};

export type Expense = {
  id: number;
  amount: number;
  category: string;
  description?: string;
  createdAt: string;
};

export type Income = {
  id: number;
  amount: number;
  source: string;
  description?: string;
  createdAt: string;
};

export type CategoryTotal = {
  category: string;
  total: number;
};

export type BudgetAlert = {
  totalExpense: number;
  monthlyBudget: number;
  status: "normal" | "near_limit" | "over_budget";
};

export type DashboardData = {
  totals: {
    totalExpense: number;
    totalIncome: number;
    remainingBalance: number;
    monthlyBudget: number;
  };
  categoryTotals: CategoryTotal[];
  budgetAlert: BudgetAlert;
  recentExpenses: Expense[];
  recentIncomes: Income[];
};

export type AdminOverview = {
  totals: {
    users: number;
    totalExpense: number;
    totalIncome: number;
    totalBudget: number;
    netFlow: number;
    records: number;
  };
  budgetHealth: {
    normal: number;
    near_limit: number;
    over_budget: number;
    without_budget: number;
  };
  topCategories: CategoryTotal[];
  recentActivity: Array<{
    type: "expense" | "income";
    label: string;
    amount: number;
    createdAt: string;
  }>;
  recentExpenses: Expense[];
  recentIncomes: Income[];
};
