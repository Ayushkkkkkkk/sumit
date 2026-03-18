type StatCardProps = {
  title: string;
  value: number;
  tone?: "default" | "positive" | "negative";
};

export function StatCard({ title, value, tone = "default" }: StatCardProps) {
  return (
    <article className={`card stat-card ${tone}`}>
      <h3>{title}</h3>
      <p>${value.toFixed(2)}</p>
    </article>
  );
}
