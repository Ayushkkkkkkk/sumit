import { Router } from "express";
import { z } from "zod";
import { addExpense, addIncome, getDashboard, getExpenses, getIncomes, setBudget } from "../controllers/financeController.js";
import { requireAuth, requireUser } from "../middleware/auth.js";
import { validateBody } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";
const financeRouter = Router();
const expenseSchema = z.object({
    amount: z.number().positive("Amount should be greater than zero"),
    category: z.string().min(1, "Category is required"),
    description: z.string().optional()
});
const incomeSchema = z.object({
    amount: z.number().positive("Amount should be greater than zero"),
    source: z.string().min(1, "Source is required"),
    description: z.string().optional()
});
const budgetSchema = z.object({
    monthlyBudget: z.number().nonnegative("Budget cannot be negative")
});
financeRouter.use(requireAuth);
financeRouter.use(requireUser);
financeRouter.get("/dashboard", asyncHandler(getDashboard));
financeRouter.get("/expenses", asyncHandler(getExpenses));
financeRouter.get("/incomes", asyncHandler(getIncomes));
financeRouter.post("/expenses", validateBody(expenseSchema), asyncHandler(addExpense));
financeRouter.post("/incomes", validateBody(incomeSchema), asyncHandler(addIncome));
financeRouter.put("/budget", validateBody(budgetSchema), asyncHandler(setBudget));
export default financeRouter;
