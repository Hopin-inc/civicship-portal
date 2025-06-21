export const parseJapaneseDateLabel = (label: string) => {
    const match = label.match(/^(\d+)月(\d+)日（(.+)）$/);
    if (!match) return { month: "", day: "", weekday: "" };
  
    const [, month, day, weekday] = match;
    return { month, day, weekday };
  };