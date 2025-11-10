/**
 * 文字列を指定された長さで切り詰め、省略記号を追加する
 * @param text 切り詰める文字列
 * @param length 最大長（省略記号を含む）
 * @param pattern 省略パターン ('middle' | 'end')
 * @returns 切り詰められた文字列
 */
export const truncateText = (
  text: string | undefined | null, 
  length: number = 20, 
  pattern?: 'middle' | 'end'
): string => {
  if (!text) return "";
  if (text.length <= length) return text;
  const patternType = pattern || 'end';
  
  if (patternType === 'end') {
    // 最後を省略するパターン（真ん中省略と同じ文字数）
    const totalLength = length + 10; // 真ん中省略と同じ文字数
    return text.substring(0, totalLength - 3) + '...';
  } else {
    // 真ん中を省略するパターン（デフォルト）
    const start = text.substring(0, length);
    const end = text.substring(text.length - 10);
    return `${start}...${end}`;
  }
};

/**
 * 文字列の中央部分を省略して短縮する（ブロックチェーンアドレスやID用）
 * @param text 短縮する文字列
 * @param head 先頭から表示する文字数（デフォルト: 6）
 * @param tail 末尾から表示する文字数（デフォルト: 4）
 * @returns 短縮された文字列（例: "abc123...xyz9"）
 */
export const shortenMiddle = (
  text: string | undefined | null,
  head: number = 6,
  tail: number = 4
): string => {
  if (!text) return "";
  if (text.length <= head + tail) return text;
  return `${text.substring(0, head)}...${text.substring(text.length - tail)}`;
};   