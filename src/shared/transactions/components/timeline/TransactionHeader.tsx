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
    <div>
      <span className="text-base font-bold">{displayName}</span>
      <span className="text-xs font-normal text-muted-foreground">・{formattedDateTime}</span>
    </div>
  );
};
