export interface TallyOption {
  id: string;
  label: string;
  count: number;
  power: number;
  percent: number;
  isWinner: boolean;
}

export function computeVoteTally(
  options: { id: string; label: string; voteCount: number | null; totalPower: number | null }[],
  usePower: boolean,
): { items: TallyOption[]; totalVoters: number; totalPower: number } {
  const totalVoters = options.reduce((sum, o) => sum + (o.voteCount ?? 0), 0);
  const totalPower = options.reduce((sum, o) => sum + (o.totalPower ?? 0), 0);
  const total = usePower ? totalPower : totalVoters;

  const items: TallyOption[] = options.map((o) => {
    const count = o.voteCount ?? 0;
    const power = o.totalPower ?? 0;
    const value = usePower ? power : count;
    return {
      id: o.id,
      label: o.label,
      count,
      power,
      percent: total > 0 ? Math.round((value / total) * 100) : 0,
      isWinner: false,
    };
  });

  items.sort((a, b) => {
    const aVal = usePower ? a.power : a.count;
    const bVal = usePower ? b.power : b.count;
    return bVal - aVal;
  });

  if (items.length > 0 && total > 0) {
    const maxVal = usePower ? items[0].power : items[0].count;
    for (const item of items) {
      const val = usePower ? item.power : item.count;
      if (val === maxVal) item.isWinner = true;
      else break;
    }
  }

  return { items, totalVoters, totalPower };
}
