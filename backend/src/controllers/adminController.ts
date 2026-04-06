import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import { calculateCategoryTotals } from "../algorithms/categoryTotals.js";
import { detectBudgetAlert } from "../algorithms/budgetAlert.js";

export async function getAdminOverview(_req: Request, res: Response): Promise<void> {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [users, expenseAggregate, incomeAggregate, budgetAggregate, allExpenses, recentExpenses, recentIncomes] =
    await Promise.all([
    prisma.user.count(),
      prisma.expense.aggregate({
        _sum: { amount: true },
        _count: { _all: true }
      }),
      prisma.income.aggregate({
        _sum: { amount: true },
        _count: { _all: true }
      }),
      prisma.budget.aggregate({
        _sum: { monthlyBudget: true },
        _count: { _all: true }
      }),
      prisma.expense.findMany({ select: { category: true, amount: true } }),
      prisma.expense.findMany({ orderBy: { createdAt: "desc" }, take: 12 }),
      prisma.income.findMany({ orderBy: { createdAt: "desc" }, take: 12 })
    ]);

  const usersWithBudget = await prisma.user.findMany({
    where: { budget: { isNot: null } },
    select: {
      id: true,
      budget: { select: { monthlyBudget: true } },
      expenses: {
        where: { createdAt: { gte: startOfMonth } },
        select: { amount: true }
      }
    }
  });

  const budgetHealth = {
    normal: 0,
    near_limit: 0,
    over_budget: 0,
    without_budget: users - usersWithBudget.length
  };

  for (const item of usersWithBudget) {
    const monthExpense = item.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const status = detectBudgetAlert(monthExpense, item.budget?.monthlyBudget ?? 0).status;
    budgetHealth[status] += 1;
  }

  const totalExpense = expenseAggregate._sum.amount ?? 0;
  const totalIncome = incomeAggregate._sum.amount ?? 0;
  const totalBudget = budgetAggregate._sum.monthlyBudget ?? 0;
  const records = (expenseAggregate._count._all ?? 0) + (incomeAggregate._count._all ?? 0);

  const topCategories = calculateCategoryTotals(allExpenses).sort((a, b) => b.total - a.total).slice(0, 6);
  const recentActivity = [...recentExpenses.map((item) => ({
    type: "expense" as const,
    label: item.category,
    amount: item.amount,
    createdAt: item.createdAt.toISOString()
  })), ...recentIncomes.map((item) => ({
    type: "income" as const,
    label: item.source,
    amount: item.amount,
    createdAt: item.createdAt.toISOString()
  }))].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 12);

  res.json({
    totals: {
      users,
      totalExpense: Number(totalExpense.toFixed(2)),
      totalIncome: Number(totalIncome.toFixed(2)),
      totalBudget: Number(totalBudget.toFixed(2)),
      netFlow: Number((totalIncome - totalExpense).toFixed(2)),
      records
    },
    budgetHealth,
    topCategories,
    recentActivity,
    recentExpenses,
    recentIncomes
  });
}
