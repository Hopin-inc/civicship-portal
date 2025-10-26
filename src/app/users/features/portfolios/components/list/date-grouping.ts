export function groupByDate<T extends { dateISO: string }>(items: T[]): Record<string, T[]> {
  if (!items) return {};
  return items.reduce(
    (acc, item) => {
      const date = item.dateISO;
      if (!acc[date]) acc[date] = [];
      acc[date].push(item);
      return acc;
    },
    {} as Record<string, T[]>,
  );
}
