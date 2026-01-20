"use client";

interface TransactionMessageCardProps {
  comment: string;
}

/**
 * テキスト内のURLを検出してリンク化する
 * Note: <a>タグのネストを避けるため、spanとonClickで実装
 * セキュリティ: http/https スキームのみ許可
 */
const linkifyText = (text: string) => {
  // URL検出用の正規表現（http, https, www で始まるURL）
  // 末尾の句読点を除外してURLの境界をより正確に検出
  const urlRegex = /(https?:\/\/[^"'`()\[\]{}<>,;.!?\s]+|www\.[^"'`()\[\]{}<>,;.!?\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    // URLの場合
    if (part.match(urlRegex)) {
      // 安全のため、http/https/www 以外で始まるスキームレスな文字列はリンク化しない
      if (
        !part.startsWith('http://') &&
        !part.startsWith('https://') &&
        !part.startsWith('www.')
      ) {
        return part;
      }

      // スキーム検証: http または https のみ許可
      const normalizedHref = part.startsWith('www.') ? `https://${part}` : part;

      try {
        const url = new URL(normalizedHref);
        // http または https 以外は拒否（XSS対策）
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          return part; // 危険なスキーム（javascript:, data:等）はテキストのまま
        }

        const href = url.toString();
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
      } catch (error) {
        // 不正な URL はテキストのまま
        console.warn('Invalid URL detected in TransactionMessageCard.linkifyText:', normalizedHref, error);
        return part;
      }
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
        <span key={`line-${lineIndex}`}>
          {linkifyText(line)}
          {lineIndex < lines.length - 1 && '\n'}
        </span>
      ))}
    </p>
  );
};
