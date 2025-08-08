interface CardGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
}

export function CardGrid({ children, columns = 2 }: CardGridProps) {
  const columnClasses = {
    1: "grid-cols-1",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
  };

  return (
    <div className={`grid gap-4 ${columnClasses[columns]}`}>
      {children}
    </div>
  );
}