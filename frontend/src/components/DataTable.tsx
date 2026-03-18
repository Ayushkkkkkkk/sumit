import type { Expense, Income } from "../types";

type DataTableProps = {
  title: string;
  rows: Array<Expense | Income>;
  kind: "expense" | "income";
};

export function DataTable({ title, rows, kind }: DataTableProps) {
  return (
    <section className="card">
      <h3>{title}</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Amount</th>
            <th>{kind === "expense" ? "Category" : "Source"}</th>
            <th>Description</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={4} className="empty-cell">
                No records yet.
              </td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr key={row.id}>
                <td>${row.amount.toFixed(2)}</td>
                <td>{kind === "expense" ? (row as Expense).category : (row as Income).source}</td>
                <td>{row.description ?? "-"}</td>
                <td>{new Date(row.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}
