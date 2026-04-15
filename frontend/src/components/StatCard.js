import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function StatCard({ title, value, tone = "default", format = "currency" }) {
    const displayValue = format === "number" ? value.toString() : `$${value.toFixed(2)}`;
    return (_jsxs("article", { className: `card stat-card ${tone}`, children: [_jsx("h3", { children: title }), _jsx("p", { children: displayValue })] }));
}
