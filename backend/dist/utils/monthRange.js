/** Inclusive start of calendar month and exclusive start of next month (local time). */
export function getCalendarMonthRange(reference = new Date()) {
    const start = new Date(reference);
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    const endExclusive = new Date(start);
    endExclusive.setMonth(endExclusive.getMonth() + 1);
    return { start, endExclusive };
}
