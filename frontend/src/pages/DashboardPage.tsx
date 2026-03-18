import { useEffect, useMemo, useState, type FormEvent } from "react";
import { apiRequest } from "../api/client";
import { StatCard } from "../components/StatCard";
import { DataTable } from "../components/DataTable";
import { useAuth } from "../context/AuthContext";
import type { DashboardData } from "../types";

export function DashboardPage() {
  const { token } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
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
      const nextData = await apiRequest<DashboardData>("/dashboard", { token });
      setData(nextData);
      setMonthlyBudget(nextData.totals.monthlyBudget.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
  }, [token]);

  async function updateBudget(e: FormEvent) {
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
    } catch (err) {
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
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p className="error-text">{error}</p>;
  }

  if (!data) {
    return <p>No data available.</p>;
  }

  return (
    <div className="dashboard-grid">
      <section className="stat-grid">
        <StatCard title="Total Income" value={data.totals.totalIncome} tone="positive" />
        <StatCard title="Total Spending" value={data.totals.totalExpense} tone="negative" />
        <StatCard title="Remaining Balance" value={data.totals.remainingBalance} />
        <StatCard title="Monthly Budget" value={data.totals.monthlyBudget} />
      </section>

      <section className={`card budget-alert ${budgetStatusClass}`}>
        <h3>Budget Alert</h3>
        <p>Status: {data.budgetAlert.status.replace("_", " ")}</p>
        <p>
          Spent ${data.budgetAlert.totalExpense.toFixed(2)} of ${data.budgetAlert.monthlyBudget.toFixed(2)}
        </p>
      </section>

      <section className="card">
        <h3>Set Monthly Budget</h3>
        <form className="row-form" onSubmit={updateBudget}>
          <input
            type="number"
            step="0.01"
            min="0"
            value={monthlyBudget}
            onChange={(e) => setMonthlyBudget(e.target.value)}
            required
          />
          <button type="submit" className="button small">
            Save Budget
          </button>
        </form>
      </section>

      <section className="card">
        <h3>Category-wise Expense Totals</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {data.categoryTotals.length === 0 ? (
              <tr>
                <td colSpan={2} className="empty-cell">
                  No expense categories yet.
                </td>
              </tr>
            ) : (
              data.categoryTotals.map((item) => (
                <tr key={item.category}>
                  <td>{item.category}</td>
                  <td>${item.total.toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <DataTable title="Recent Expenses" rows={data.recentExpenses} kind="expense" />
      <DataTable title="Recent Incomes" rows={data.recentIncomes} kind="income" />
    </div>
  );
}
