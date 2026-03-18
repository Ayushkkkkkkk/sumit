export type BudgetStatus = "normal" | "near_limit" | "over_budget";

type BudgetAlertResult = {
  totalExpense: number;
  monthlyBudget: number;
  status: BudgetStatus;
};

// Algorithm 2: Compare total expense with budget and return budget health status.
export function detectBudgetAlert(totalExpense: number, monthlyBudget: number): BudgetAlertResult {
  if (monthlyBudget <= 0) {
    return {
      totalExpense: Number(totalExpense.toFixed(2)),
      monthlyBudget: Number(monthlyBudget.toFixed(2)),
      status: "over_budget"
    };
  }

  const ratio = totalExpense / monthlyBudget;
  let status: BudgetStatus = "normal";

  if (ratio > 1) {
    status = "over_budget";
  } else if (ratio >= 0.9) {
    status = "near_limit";
  }

  return {
    totalExpense: Number(totalExpense.toFixed(2)),
    monthlyBudget: Number(monthlyBudget.toFixed(2)),
    status
  };
}
