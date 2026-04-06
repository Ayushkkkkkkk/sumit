import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../api/client";
import { DataTable } from "../components/DataTable";
import { StatCard } from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import type { AdminOverview } from "../types";

export function AdminPage() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadOverview = useCallback(async () => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await apiRequest<AdminOverview>("/admin/overview", { token });
      setData(response);
      setLastUpdated(new Date());
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load admin overview";
      setError(message);
      if (message.toLowerCase().includes("only admin") || message.toLowerCase().includes("invalid")) {
        logout();
        navigate("/", { replace: true });
      }
    } finally {
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
    return <p>Loading admin panel...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (!data) {
    return <p>No admin data available.</p>;
  }

  return (
    <div className="dashboard-grid">
      <h2 className="section-title">Admin Panel</h2>
      <div className="admin-toolbar">
        <span>Last updated: {lastUpdated ? lastUpdated.toLocaleTimeString() : "-"}</span>
        <button type="button" className="button small" onClick={() => void loadOverview()}>
          Refresh
        </button>
      </div>
      <section className="stat-grid">
        <StatCard title="Total Users" value={data.totals.users} format="number" />
        <StatCard title="Platform Income" value={data.totals.totalIncome} tone="positive" />
        <StatCard title="Platform Expense" value={data.totals.totalExpense} tone="negative" />
        <StatCard title="Total Budget Set" value={data.totals.totalBudget} />
        <StatCard title="Net Flow" value={data.totals.netFlow} />
        <StatCard title="Total Records" value={data.totals.records} format="number" />
      </section>

      <section className="card admin-insights-grid">
        <div>
          <h3>Budget Health (Current Month)</h3>
          <ul className="health-list">
            <li>
              <span>Normal</span>
              <strong>{data.budgetHealth.normal}</strong>
            </li>
            <li>
              <span>Near Limit</span>
              <strong>{data.budgetHealth.near_limit}</strong>
            </li>
            <li>
              <span>Over Budget</span>
              <strong>{data.budgetHealth.over_budget}</strong>
            </li>
            <li>
              <span>Without Budget</span>
              <strong>{data.budgetHealth.without_budget}</strong>
            </li>
          </ul>
        </div>

        <div>
          <h3>Top Expense Categories</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.topCategories.length === 0 ? (
                <tr>
                  <td colSpan={2} className="empty-cell">
                    No category data yet.
                  </td>
                </tr>
              ) : (
                data.topCategories.map((item) => (
                  <tr key={item.category}>
                    <td>{item.category}</td>
                    <td>${item.total.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card">
        <h3>Recent Activity Feed</h3>
        <div className="activity-list">
          {data.recentActivity.length === 0 ? (
            <p className="empty-cell">No recent activity.</p>
          ) : (
            data.recentActivity.map((item, idx) => (
              <div key={`${item.type}-${item.createdAt}-${idx}`} className="activity-item">
                <span className={`badge ${item.type === "income" ? "income" : "expense"}`}>
                  {item.type}
                </span>
                <span>{item.label}</span>
                <strong>{item.type === "income" ? "+" : "-"}${item.amount.toFixed(2)}</strong>
                <small>{new Date(item.createdAt).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      </section>
      <DataTable title="Latest Expenses (All Users)" rows={data.recentExpenses} kind="expense" />
      <DataTable title="Latest Incomes (All Users)" rows={data.recentIncomes} kind="income" />
    </div>
  );
}
