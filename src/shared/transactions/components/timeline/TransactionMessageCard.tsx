"use client";

interface TransactionMessageCardProps {
  comment: string;
}

export const TransactionMessageCard = ({
  comment,
}: TransactionMessageCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-sm whitespace-pre-line break-words leading-relaxed text-label-sm">
      {comment}
    </div>
  );
};
