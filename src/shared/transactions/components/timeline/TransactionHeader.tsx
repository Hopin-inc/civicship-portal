"use client";

interface TransactionHeaderProps {
  displayName: string;
  formattedDateTime: string;
}

export const TransactionHeader = ({
  displayName,
  formattedDateTime,
}: TransactionHeaderProps) => {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-label-sm font-bold truncate">
        {displayName}
      </span>
      <span className="text-label-xs text-muted-foreground shrink-0">
        {formattedDateTime}
      </span>
    </div>
  );
};
