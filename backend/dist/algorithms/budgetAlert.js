import { getCalendarMonthRange } from "../utils/monthRange.js";
const NEAR_LIMIT_RATIO = 0.9;
const EPS_TIME = 1e-9;
function classifyStatus(monthToDate, forecast, monthlyBudget) {
    if (monthToDate > monthlyBudget || forecast > monthlyBudget) {
        return "over_budget";
    }
    if (monthToDate >= NEAR_LIMIT_RATIO * monthlyBudget || forecast >= NEAR_LIMIT_RATIO * monthlyBudget) {
        return "near_limit";
    }
    return "normal";
}
/**
 * Ordinary least squares (OLS) linear regression y ≈ a + b·x on points (x, y),
 * evaluated at x = 1 (end of month on a 0..1 time scale).
 */
function olsPredictAtOne(xs, ys) {
    const n = xs.length;
    if (n === 0) {
        return null;
    }
    if (n === 1) {
        const x = xs[0];
        const y = ys[0];
        if (x > EPS_TIME) {
            return (y / x) * 1;
        }
        return y;
    }
    let sumX = 0;
    let sumY = 0;
    let sumXX = 0;
    let sumXY = 0;
    for (let i = 0; i < n; i += 1) {
        sumX += xs[i];
        sumY += ys[i];
        sumXX += xs[i] * xs[i];
        sumXY += xs[i] * ys[i];
    }
    const denom = n * sumXX - sumX * sumX;
    if (Math.abs(denom) < EPS_TIME) {
        return sumY / n;
    }
    const b = (n * sumXY - sumX * sumY) / denom;
    const a = (sumY - b * sumX) / n;
    return a + b * 1;
}
function buildMonthSeries(expenses, monthStart, monthEndExclusive) {
    const spanMs = monthEndExclusive.getTime() - monthStart.getTime();
    if (spanMs <= 0) {
        return { xs: [], ys: [], monthToDate: 0 };
    }
    const sorted = [...expenses].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
    const xs = [];
    const ys = [];
    let cumulative = 0;
    for (const row of sorted) {
        cumulative += row.amount;
        const t = (row.createdAt.getTime() - monthStart.getTime()) / spanMs;
        const x = Math.min(1, Math.max(0, t));
        xs.push(x);
        ys.push(cumulative);
    }
    return { xs, ys, monthToDate: cumulative };
}
/**
 * Forecast end-of-month spend with OLS on (time-in-month, cumulative spend), then
 * derive alert status from actual month-to-date and prediction vs monthly budget.
 */
export function detectBudgetAlert(monthExpenses, monthlyBudget, referenceDate = new Date()) {
    const { start, endExclusive } = getCalendarMonthRange(referenceDate);
    const { xs, ys, monthToDate } = buildMonthSeries(monthExpenses, start, endExclusive);
    const monthToDateExpense = Number(monthToDate.toFixed(2));
    const budgetRounded = Number(monthlyBudget.toFixed(2));
    if (monthlyBudget <= 0) {
        return {
            monthToDateExpense,
            monthlyBudget: budgetRounded,
            predictedEndOfMonthExpense: monthToDateExpense,
            status: monthToDateExpense > 0 ? "over_budget" : "normal"
        };
    }
    const rawForecast = olsPredictAtOne(xs, ys) ?? 0;
    const predictedEndOfMonthExpense = Number(Math.max(monthToDateExpense, rawForecast, 0).toFixed(2));
    return {
        monthToDateExpense,
        monthlyBudget: budgetRounded,
        predictedEndOfMonthExpense,
        status: classifyStatus(monthToDateExpense, predictedEndOfMonthExpense, monthlyBudget)
    };
}
