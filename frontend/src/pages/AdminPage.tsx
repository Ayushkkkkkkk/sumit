import { useEffect, useState } from "react";
import { apiRequest } from "../api/client";
import { DataTable } from "../components/DataTable";
import { StatCard } from "../components/StatCard";
import { useAuth } from "../context/AuthContext";
import type { AdminOverview } from "../types";

export function AdminPage() {
  const { token } = useAuth();
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      if (!token) {
        return;
      }

      setLoading(true);
      setError("");
      try {
        const response = await apiRequest<AdminOverview>("/admin/overview", { token });
        setData(response);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load admin overview");
      } finally {
        setLoading(false);
      }
    }

    void loadOverview();
  }, [token]);

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
      <section className="stat-grid">
        <StatCard title="Total Users" value={data.totals.users} format="number" />
        <StatCard title="Platform Income" value={data.totals.totalIncome} tone="positive" />
        <StatCard title="Platform Expense" value={data.totals.totalExpense} tone="negative" />
        <StatCard title="Total Budget Set" value={data.totals.totalBudget} />
      </section>
      <DataTable title="Latest Expenses (All Users)" rows={data.recentExpenses} kind="expense" />
      <DataTable title="Latest Incomes (All Users)" rows={data.recentIncomes} kind="income" />
    </div>
  );
}
