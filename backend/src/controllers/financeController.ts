import type { Request, Response } from "express";
import { prisma } from "../utils/prisma.js";
import { calculateCategoryTotals } from "../algorithms/categoryTotals.js";
import { detectBudgetAlert } from "../algorithms/budgetAlert.js";

function getUserId(req: Request): number {
  if (!req.user?.userId) {
    throw new Error("Missing authenticated user");
  }
  return req.user.userId;
}

export async function addExpense(req: Request, res: Response): Promise<void> {
  const userId = getUserId(req);
  const { amount, category, description } = req.body as {
    amount: number;
    category: string;
    description?: string;
  };

  const expense = await prisma.expense.create({
    data: {
      amount,
      category,
      description,
      userId
    }
  });

  res.status(201).json(expense);
}

export async function addIncome(req: Request, res: Response): Promise<void> {
  const userId = getUserId(req);
  const { amount, source, description } = req.body as {
    amount: number;
    source: string;
    description?: string;
  };

  const income = await prisma.income.create({
    data: {
      amount,
      source,
      description,
      userId
    }
  });

  res.status(201).json(income);
}

export async function setBudget(req: Request, res: Response): Promise<void> {
  const userId = getUserId(req);
  const { monthlyBudget } = req.body as { monthlyBudget: number };

  const budget = await prisma.budget.upsert({
    where: { userId },
    create: { userId, monthlyBudget },
    update: { monthlyBudget }
  });

  res.json(budget);
}

export async function getExpenses(req: Request, res: Response): Promise<void> {
  const userId = getUserId(req);
  const expenses = await prisma.expense.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
  res.json(expenses);
}

export async function getIncomes(req: Request, res: Response): Promise<void> {
  const userId = getUserId(req);
  const incomes = await prisma.income.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
  res.json(incomes);
}

export async function getDashboard(req: Request, res: Response): Promise<void> {
  const userId = getUserId(req);
  const [expenses, incomes, budget] = await Promise.all([
    prisma.expense.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.income.findMany({ where: { userId }, orderBy: { createdAt: "desc" } }),
    prisma.budget.findUnique({ where: { userId } })
  ]);

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const totalIncome = incomes.reduce((sum, item) => sum + item.amount, 0);
  const remainingBalance = totalIncome - totalExpense;
  const monthlyBudget = budget?.monthlyBudget ?? 0;

  const categoryTotals = calculateCategoryTotals(expenses);
  const budgetAlert = detectBudgetAlert(totalExpense, monthlyBudget);

  res.json({
    totals: {
      totalExpense: Number(totalExpense.toFixed(2)),
      totalIncome: Number(totalIncome.toFixed(2)),
      remainingBalance: Number(remainingBalance.toFixed(2)),
      monthlyBudget: Number(monthlyBudget.toFixed(2))
    },
    categoryTotals,
    budgetAlert,
    recentExpenses: expenses.slice(0, 10),
    recentIncomes: incomes.slice(0, 10)
  });
}
