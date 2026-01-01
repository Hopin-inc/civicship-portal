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
    <div className="text-label-sm">
      <span className="font-bold">{displayName}</span>
      <span className="text-muted-foreground">・{formattedDateTime}</span>
    </div>
  );
};
