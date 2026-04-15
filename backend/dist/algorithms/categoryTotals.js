function mergeSortedByCategory(left, right) {
    const out = [];
    let i = 0;
    let j = 0;
    while (i < left.length && j < right.length) {
        if (left[i].category.localeCompare(right[j].category) <= 0) {
            out.push(left[i]);
            i += 1;
        }
        else {
            out.push(right[j]);
            j += 1;
        }
    }
    while (i < left.length) {
        out.push(left[i]);
        i += 1;
    }
    while (j < right.length) {
        out.push(right[j]);
        j += 1;
    }
    return out;
}
/** Merge sort by category (lexicographic), O(n log n) comparisons. */
function mergeSortByCategory(items) {
    if (items.length <= 1) {
        return items;
    }
    const mid = Math.floor(items.length / 2);
    const left = mergeSortByCategory(items.slice(0, mid));
    const right = mergeSortByCategory(items.slice(mid));
    return mergeSortedByCategory(left, right);
}
/** Single pass over sorted-by-category rows to sum consecutive equal categories. */
function aggregateSortedByCategory(sorted) {
    if (sorted.length === 0) {
        return [];
    }
    const result = [];
    let category = sorted[0].category;
    let sum = sorted[0].amount;
    for (let k = 1; k < sorted.length; k += 1) {
        const row = sorted[k];
        if (row.category === category) {
            sum += row.amount;
        }
        else {
            result.push({ category, total: Number(sum.toFixed(2)) });
            category = row.category;
            sum = row.amount;
        }
    }
    result.push({ category, total: Number(sum.toFixed(2)) });
    return result;
}
// Algorithm 1: merge sort by category, then linear merge-aggregation of totals.
export function calculateCategoryTotals(expenses) {
    const sorted = mergeSortByCategory([...expenses]);
    return aggregateSortedByCategory(sorted);
}
