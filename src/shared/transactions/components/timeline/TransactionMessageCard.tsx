"use client";

interface TransactionMessageCardProps {
  comment: string;
}

/**
 * テキスト内のURLを検出してリンク化する
 * Note: <a>タグのネストを避けるため、spanとonClickで実装
 */
const linkifyText = (text: string) => {
  // URL検出用の正規表現（http, https, www で始まるURL）
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    // URLの場合
    if (part.match(urlRegex)) {
      // www. で始まる場合は https:// を付ける
      const href = part.startsWith('www.') ? `https://${part}` : part;
      return (
        <span
          key={index}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            window.open(href, '_blank', 'noopener,noreferrer');
          }}
          className="text-primary underline hover:text-primary/80 cursor-pointer"
          role="link"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              window.open(href, '_blank', 'noopener,noreferrer');
            }
          }}
        >
          {part}
        </span>
      );
    }
    // 通常のテキストの場合
    return part;
  });
};

/**
 * トランザクションに添付されたメッセージ（コメント）を表示
 * プレーンテキストで、背景色なし
 * URL自動リンク化対応
 */
export const TransactionMessageCard = ({
  comment,
}: TransactionMessageCardProps) => {
  // 改行で分割して、各行ごとにリンク化処理
  const lines = comment.split('\n');

  return (
    <p className="text-label-sm whitespace-pre-line break-words leading-relaxed">
      {lines.map((line, lineIndex) => (
        <span key={lineIndex}>
          {linkifyText(line)}
          {lineIndex < lines.length - 1 && '\n'}
        </span>
      ))}
    </p>
  );
};
