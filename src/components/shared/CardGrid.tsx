interface CardGridProps {
  children: React.ReactNode;
}

export function CardGrid({ children }: CardGridProps) {
  return (
    <div className="grid gap-4 grid-cols-2">
      {children}
    </div>
  );
}