import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { apiRequest } from "../api/client";
import { StatCard } from "../components/StatCard";
import { DataTable } from "../components/DataTable";
import { useAuth } from "../context/AuthContext";
export function DashboardPage() {
    const { token } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [monthlyBudget, setMonthlyBudget] = useState("");
    async function loadData() {
        if (!token) {
            return;
        }
        setLoading(true);
        setError("");
        try {
            const nextData = await apiRequest("/dashboard", { token });
            setData(nextData);
            setMonthlyBudget(nextData.totals.monthlyBudget.toString());
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load dashboard");
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        void loadData();
    }, [token]);
    async function updateBudget(e) {
        e.preventDefault();
        if (!token) {
            return;
        }
        try {
            await apiRequest("/budget", {
                method: "PUT",
                token,
                body: { monthlyBudget: Number(monthlyBudget) }
            });
            await loadData();
        }
        catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update budget");
        }
    }
    const budgetStatusClass = useMemo(() => {
        const status = data?.budgetAlert.status;
        if (status === "over_budget") {
            return "alert-over";
        }
        if (status === "near_limit") {
            return "alert-near";
        }
        return "alert-normal";
    }, [data?.budgetAlert.status]);
    if (loading) {
        return _jsx("p", { children: "Loading dashboard..." });
    }
    if (error) {
        return _jsx("p", { className: "error-text", children: error });
    }
    if (!data) {
        return _jsx("p", { children: "No data available." });
    }
    return (_jsxs("div", { className: "dashboard-grid", children: [_jsxs("section", { className: "stat-grid", children: [_jsx(StatCard, { title: "Total Income", value: data.totals.totalIncome, tone: "positive" }), _jsx(StatCard, { title: "Total Spending", value: data.totals.totalExpense, tone: "negative" }), _jsx(StatCard, { title: "Remaining Balance", value: data.totals.remainingBalance }), _jsx(StatCard, { title: "Monthly Budget", value: data.totals.monthlyBudget })] }), _jsxs("section", { className: `card budget-alert ${budgetStatusClass}`, children: [_jsx("h3", { children: "Budget Alert" }), _jsxs("p", { children: ["Status: ", data.budgetAlert.status.replace(/_/g, " ")] }), _jsxs("p", { children: ["Month to date: $", data.budgetAlert.monthToDateExpense.toFixed(2), " of", " ", "$", data.budgetAlert.monthlyBudget.toFixed(2), " budget"] }), _jsxs("p", { children: ["Predicted end of month (OLS trend): $", data.budgetAlert.predictedEndOfMonthExpense.toFixed(2)] })] }), _jsxs("section", { className: "card", children: [_jsx("h3", { children: "Set Monthly Budget" }), _jsxs("form", { className: "row-form", onSubmit: updateBudget, children: [_jsx("input", { type: "number", step: "0.01", min: "0", value: monthlyBudget, onChange: (e) => setMonthlyBudget(e.target.value), required: true }), _jsx("button", { type: "submit", className: "button small", children: "Save Budget" })] })] }), _jsxs("section", { className: "card", children: [_jsx("h3", { children: "Category-wise Expense Totals" }), _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Category" }), _jsx("th", { children: "Total" })] }) }), _jsx("tbody", { children: data.categoryTotals.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 2, className: "empty-cell", children: "No expense categories yet." }) })) : (data.categoryTotals.map((item) => (_jsxs("tr", { children: [_jsx("td", { children: item.category }), _jsxs("td", { children: ["$", item.total.toFixed(2)] })] }, item.category)))) })] })] }), _jsx(DataTable, { title: "Recent Expenses", rows: data.recentExpenses, kind: "expense" }), _jsx(DataTable, { title: "Recent Incomes", rows: data.recentIncomes, kind: "income" })] }));
}
