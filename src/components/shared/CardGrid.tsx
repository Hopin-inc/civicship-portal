interface CardGridProps {
    children: React.ReactNode;
    columns?: 1 | 2 | 3 | 4;
  }
  
  export function CardGrid({ children, columns = 2 }: CardGridProps) {
    return (
      <div className={`grid grid-cols-${columns}`}>
        {children}
      </div>
    );
  }