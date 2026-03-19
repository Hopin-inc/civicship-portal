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
  // ドットや?は含めて広くマッチさせ、末尾の句読点は後で除去する
  const urlRegex = /(https?:\/\/[^\s"'`()\[\]{}<>]+|www\.[^\s"'`()\[\]{}<>]+)/g;
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

      // 末尾の句読点を除去（文章末にURLが来る場合に対応）
      const trimmedPart = part.replace(/[.,;!?)\]]+$/, '');

      // スキーム検証: http または https のみ許可
      const normalizedHref = trimmedPart.startsWith('www.') ? `https://${trimmedPart}` : trimmedPart;

      try {
        const url = new URL(normalizedHref);
        // http または https 以外は拒否（XSS対策）
        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
          return part; // 危険なスキーム（javascript:, data:等）はテキストのまま
        }

        // 認証情報を含むURLを拒否（フィッシング対策）
        if (url.username || url.password) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('URL with credentials rejected:', normalizedHref);
          }
          return part;
        }

        // ホスト名の基本検証
        if (!url.hostname || url.hostname.includes('@')) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn('Invalid hostname detected:', normalizedHref);
          }
          return part;
        }

        const href = url.toString();
        // 末尾に句読点があった場合は、リンク後にテキストとして追加
        const trailingText = part.slice(trimmedPart.length);
        return (
          <span key={index}>
            <span
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
              {trimmedPart}
            </span>
            {trailingText}
          </span>
        );
      } catch (error) {
        // 不正な URL はテキストのまま
        if (process.env.NODE_ENV !== 'production') {
          console.warn('Invalid URL detected in TransactionMessageCard.linkifyText:', normalizedHref, error);
        }
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
