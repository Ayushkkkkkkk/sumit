type ExpenseLike = {
  category: string;
  amount: number;
};

export type CategoryTotal = {
  category: string;
  total: number;
};

// Algorithm 1: Group expenses by category and total each category amount.
export function calculateCategoryTotals(expenses: ExpenseLike[]): CategoryTotal[] {
  const grouped: Record<string, number> = {};

  for (const expense of expenses) {
    const current = grouped[expense.category] ?? 0;
    grouped[expense.category] = current + expense.amount;
  }

  return Object.entries(grouped).map(([category, total]) => ({
    category,
    total: Number(total.toFixed(2))
  }));
}
