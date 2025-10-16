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
 * @returns 数値（無効な値の場合は0）
 * 
 * @example
 * parseBigIntToNumber("100") // 100
 * parseBigIntToNumber(100) // 100
 * parseBigIntToNumber(null) // 0
 * parseBigIntToNumber(undefined) // 0
 * parseBigIntToNumber("") // 0 (APIが空文字列を返す場合に対応)
 * 
 * @note
 * 空文字列やnull/undefinedは0にフォールバックする。
 * これにより、旧GraphQLスキーマやStrapiとの互換性を保ち、
 * 「ポイントがない」状態を正しく扱える。
 */
export function parseBigIntToNumber(value: unknown): number {
  if (value === undefined || value === null || value === '') {
    return 0;
  }
  
  const num = typeof value === 'string' ? Number(value) : value;
  
  if (typeof num !== 'number' || isNaN(num)) {
    console.warn('[BigInt] Invalid value for number conversion:', value);
    return 0;
  }
  
  return num;
}
