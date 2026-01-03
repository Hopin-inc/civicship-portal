"use client";

interface TransactionMessageCardProps {
  comment: string;
}

/**
 * トランザクションに添付されたメッセージ（コメント）を表示
 * プレーンテキストで、背景色なし
 */
export const TransactionMessageCard = ({
  comment,
}: TransactionMessageCardProps) => {
  return (
    <p className="text-label-sm whitespace-pre-line break-words leading-relaxed">
      {comment}
    </p>
  );
};
