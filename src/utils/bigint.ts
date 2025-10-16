/**
 * GraphQL BigInt型のユーティリティ関数
 * 
 * バックエンドではBigIntが文字列としてシリアライズされるため、
 * フロントエンドで数値に変換する必要がある
 */

/**
 * GraphQL BigInt型を安全に数値に変換
 * 
 * @param value - BigInt、数値、または文字列
 * @param defaultValue - 変換できない場合のデフォルト値
 * @returns 変換された数値またはデフォルト値
 * 
 * @example
 * toNumberSafe("100") // 100
 * toNumberSafe(100) // 100
 * toNumberSafe(BigInt(100)) // 100
 * toNumberSafe(null) // 0
 * toNumberSafe(undefined) // 0
 * toNumberSafe("") // 0
 * toNumberSafe("0") // 0
 * toNumberSafe(null, 999) // 999
 * 
 * @note
 * BigIntがNUMBER.MAX_SAFE_INTEGERを超える場合は警告を出力
 */
export function toNumberSafe(
  value: bigint | number | null | undefined,
  defaultValue: number = 0
): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  if (typeof value === 'number') {
    return value;
  }
  
  if (typeof value === 'bigint') {
    if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
      console.warn('[BigInt] BigInt value exceeds MAX_SAFE_INTEGER, precision may be lost');
    }
    return Number(value);
  }
  
  if (typeof value === 'string') {
    if (value === '') {
      return defaultValue;
    }
    const num = Number(value);
    if (isNaN(num)) {
      console.warn('[BigInt] Invalid number string:', value);
      return defaultValue;
    }
    return num;
  }
  
  return defaultValue;
}
