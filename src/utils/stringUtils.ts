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
  pattern: 'middle' | 'end' = 'middle'
): string => {
  if (!text) return "";
  if (text.length <= length) return text;
  
  if (pattern === 'end') {
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