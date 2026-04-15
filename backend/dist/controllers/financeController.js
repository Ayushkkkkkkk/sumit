import { prisma } from "../utils/prisma.js";
import { calculateCategoryTotals } from "../algorithms/categoryTotals.js";
import { detectBudgetAlert } from "../algorithms/budgetAlert.js";
import { getCalendarMonthRange } from "../utils/monthRange.js";
function getUserId(req) {
    if (!req.user?.userId) {
        throw new Error("Missing authenticated user");
    }
    return req.user.userId;
}
export async function addExpense(req, res) {
    const userId = getUserId(req);
    const { amount, category, description } = req.body;
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
export async function addIncome(req, res) {
    const userId = getUserId(req);
    const { amount, source, description } = req.body;
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
export async function setBudget(req, res) {
    const userId = getUserId(req);
    const { monthlyBudget } = req.body;
    const budget = await prisma.budget.upsert({
        where: { userId },
        create: { userId, monthlyBudget },
        update: { monthlyBudget }
    });
    res.json(budget);
}
export async function getExpenses(req, res) {
    const userId = getUserId(req);
    const expenses = await prisma.expense.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
    });
    res.json(expenses);
}
export async function getIncomes(req, res) {
    const userId = getUserId(req);
    const incomes = await prisma.income.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" }
    });
    res.json(incomes);
}
export async function getDashboard(req, res) {
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
    const { start: monthStart, endExclusive: monthEndExclusive } = getCalendarMonthRange();
    const monthExpenses = expenses.filter((item) => item.createdAt >= monthStart && item.createdAt < monthEndExclusive);
    const categoryTotals = calculateCategoryTotals(expenses);
    const budgetAlert = detectBudgetAlert(monthExpenses.map((item) => ({ amount: item.amount, createdAt: item.createdAt })), monthlyBudget);
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
