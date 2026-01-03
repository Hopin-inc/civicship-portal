"use client";

interface TransactionHeaderProps {
  displayName: string;
  formattedDateTime: string;
}

/**
 * トランザクションのヘッダー（名前と日時）
 * フォーマット: "Suzanne Lloyd・2024/01/15 14:30"
 */
export const TransactionHeader = ({
  displayName,
  formattedDateTime,
}: TransactionHeaderProps) => {
  return (
    <div className="flex items-center gap-1 min-w-0">
      <span className="text-base font-bold truncate">{displayName}</span>
      <span className="text-xs font-normal text-muted-foreground whitespace-nowrap">
        ・{formattedDateTime}
      </span>
    </div>
  );
};
