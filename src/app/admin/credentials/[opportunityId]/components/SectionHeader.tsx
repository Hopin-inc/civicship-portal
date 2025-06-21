import { parseJapaneseDateLabel } from "../functions";

export const SectionHeader = ({ label }: { label: string }) => {
    const { month, day, weekday } = parseJapaneseDateLabel(label);
  
    return (
      <h2 className="flex items-baseline gap-1 mb-2">
        <span className="text-lg text-gray-500">{month}/</span>
        <span className="text-display-xl">{day}</span>
        <span className="text-sm text-gray-500">（{weekday}）</span>
      </h2>
    );
  };