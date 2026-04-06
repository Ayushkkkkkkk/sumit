type StatCardProps = {
  title: string;
  value: number;
  tone?: "default" | "positive" | "negative";
  format?: "currency" | "number";
};

export function StatCard({ title, value, tone = "default", format = "currency" }: StatCardProps) {
  const displayValue = format === "number" ? value.toString() : `$${value.toFixed(2)}`;
  return (
    <article className={`card stat-card ${tone}`}>
      <h3>{title}</h3>
      <p>{displayValue}</p>
    </article>
  );
}
