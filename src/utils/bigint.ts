/**
 * GraphQL BigInt型のユーティリティ関数
 * 
 * バックエンドではBigIntが文字列としてシリアライズされるため、
 * フロントエンドで数値に変換する必要がある
 */

/**
 * GraphQLのBigInt型（文字列としてシリアライズ）を数値に変換
 * 
 * @param value - BigInt値（文字列または数値）
 * @returns 数値（データが存在しない場合はnull）
 * 
 * @example
 * parseBigIntToNumber("100") // 100
 * parseBigIntToNumber(100) // 100
 * parseBigIntToNumber(null) // null
 * parseBigIntToNumber(undefined) // null
 * parseBigIntToNumber("") // null
 * parseBigIntToNumber("0") // 0
 * 
 * @note
 * null/undefinedはnullを返す。これにより「データなし」と「ポイント0」を区別できる。
 */
export function parseBigIntToNumber(value: unknown): number | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  
  const num = typeof value === 'string' ? Number(value) : value;
  
  if (typeof num !== 'number' || isNaN(num)) {
    console.warn('[BigInt] Invalid value for number conversion:', value);
    return null;
  }
  
  return num;
}
