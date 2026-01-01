"use client";

interface TransactionMessageCardProps {
  comment: string;
}

export const TransactionMessageCard = ({
  comment,
}: TransactionMessageCardProps) => {
  return (
    <p className="text-label-sm whitespace-pre-line break-words leading-relaxed">
      {comment}
    </p>
  );
};
