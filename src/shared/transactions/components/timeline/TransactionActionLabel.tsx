"use client";

interface TransactionActionLabelProps {
  text: string;
  amount?: string;
  amountClassName?: string;
}

export const TransactionActionLabel = ({
  text,
  amount,
  amountClassName,
}: TransactionActionLabelProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs text-muted-foreground min-w-0">
        {text}
      </p>
      {amount && (
        <span className={amountClassName}>
          {amount}
        </span>
      )}
    </div>
  );
};
