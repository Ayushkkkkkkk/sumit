import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";

export async function getAdminOverview(_req: Request, res: Response): Promise<void> {
  const [users, expenses, incomes, budgets] = await Promise.all([
    prisma.user.count(),
    prisma.expense.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.income.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
    prisma.budget.findMany()
  ]);

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const totalBudget = budgets.reduce((sum, item) => sum + item.monthlyBudget, 0);

  res.json({
    totals: {
      users,
      totalExpense: Number(totalExpense.toFixed(2)),
      totalIncome: Number(totalIncome.toFixed(2)),
      totalBudget: Number(totalBudget.toFixed(2))
    },
    recentExpenses: expenses,
    recentIncomes: incomes
  });
}
