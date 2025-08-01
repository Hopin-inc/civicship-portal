/**
 * 文字列を指定された長さで切り詰め、省略記号を追加する
 * @param text 切り詰める文字列
 * @param length 最大長（省略記号を含む）
 * @returns 切り詰められた文字列
 */
export const truncateText = (text: string | undefined | null, length: number = 20): string => {
  if (!text) return "";
  if (text.length <= length) return text;
  const start = text.substring(0, length);
  const end = text.substring(text.length - 10);
  return `${start}...${end}`;
}; 