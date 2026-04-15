import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";
import { DataTable } from "../components/DataTable";
import { StatCard } from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
export function AdminPage() {
    const { token, logout } = useAuth();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState(null);
    const loadOverview = useCallback(async () => {
        if (!token) {
            return;
        }
        setLoading(true);
        setError("");
        try {
            const response = await apiRequest("/admin/overview", { token });
            setData(response);
            setLastUpdated(new Date());
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Failed to load admin overview";
            setError(message);
            if (message.toLowerCase().includes("only admin") || message.toLowerCase().includes("invalid")) {
                logout();
                navigate("/", { replace: true });
            }
        }
        finally {
            setLoading(false);
        }
    }, [token, logout, navigate]);
    useEffect(() => {
        void loadOverview();
        const intervalId = setInterval(() => {
            void loadOverview();
        }, 30000);
        return () => clearInterval(intervalId);
    }, [loadOverview]);
    if (loading) {
        return _jsx("p", { children: "Loading admin panel..." });
    }
    if (error) {
        return _jsx("p", { className: "error-text", children: error });
    }
    if (!data) {
        return _jsx("p", { children: "No admin data available." });
    }
    return (_jsxs("div", { className: "dashboard-grid", children: [_jsx("h2", { className: "section-title", children: "Admin Panel" }), _jsxs("div", { className: "admin-toolbar", children: [_jsxs("span", { children: ["Last updated: ", lastUpdated ? lastUpdated.toLocaleTimeString() : "-"] }), _jsx("button", { type: "button", className: "button small", onClick: () => void loadOverview(), children: "Refresh" })] }), _jsxs("section", { className: "stat-grid", children: [_jsx(StatCard, { title: "Total Users", value: data.totals.users, format: "number" }), _jsx(StatCard, { title: "Platform Income", value: data.totals.totalIncome, tone: "positive" }), _jsx(StatCard, { title: "Platform Expense", value: data.totals.totalExpense, tone: "negative" }), _jsx(StatCard, { title: "Total Budget Set", value: data.totals.totalBudget }), _jsx(StatCard, { title: "Net Flow", value: data.totals.netFlow }), _jsx(StatCard, { title: "Total Records", value: data.totals.records, format: "number" })] }), _jsxs("section", { className: "card admin-insights-grid", children: [_jsxs("div", { children: [_jsx("h3", { children: "Budget Health (Current Month)" }), _jsxs("ul", { className: "health-list", children: [_jsxs("li", { children: [_jsx("span", { children: "Normal" }), _jsx("strong", { children: data.budgetHealth.normal })] }), _jsxs("li", { children: [_jsx("span", { children: "Near Limit" }), _jsx("strong", { children: data.budgetHealth.near_limit })] }), _jsxs("li", { children: [_jsx("span", { children: "Over Budget" }), _jsx("strong", { children: data.budgetHealth.over_budget })] }), _jsxs("li", { children: [_jsx("span", { children: "Without Budget" }), _jsx("strong", { children: data.budgetHealth.without_budget })] })] })] }), _jsxs("div", { children: [_jsx("h3", { children: "Top Expense Categories" }), _jsxs("table", { className: "table", children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "Category" }), _jsx("th", { children: "Total" })] }) }), _jsx("tbody", { children: data.topCategories.length === 0 ? (_jsx("tr", { children: _jsx("td", { colSpan: 2, className: "empty-cell", children: "No category data yet." }) })) : (data.topCategories.map((item) => (_jsxs("tr", { children: [_jsx("td", { children: item.category }), _jsxs("td", { children: ["$", item.total.toFixed(2)] })] }, item.category)))) })] })] })] }), _jsxs("section", { className: "card", children: [_jsx("h3", { children: "Recent Activity Feed" }), _jsx("div", { className: "activity-list", children: data.recentActivity.length === 0 ? (_jsx("p", { className: "empty-cell", children: "No recent activity." })) : (data.recentActivity.map((item, idx) => (_jsxs("div", { className: "activity-item", children: [_jsx("span", { className: `badge ${item.type === "income" ? "income" : "expense"}`, children: item.type }), _jsx("span", { children: item.label }), _jsxs("strong", { children: [item.type === "income" ? "+" : "-", "$", item.amount.toFixed(2)] }), _jsx("small", { children: new Date(item.createdAt).toLocaleString() })] }, `${item.type}-${item.createdAt}-${idx}`)))) })] }), _jsx(DataTable, { title: "Latest Expenses (All Users)", rows: data.recentExpenses, kind: "expense" }), _jsx(DataTable, { title: "Latest Incomes (All Users)", rows: data.recentIncomes, kind: "income" })] }));
}
