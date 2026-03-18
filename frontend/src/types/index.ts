export type User = {
  id: number;
  name: string;
  email: string;
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
