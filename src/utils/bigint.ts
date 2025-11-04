/**
 * GraphQL BigInt型のユーティリティ関数
 * 
 * バックエンドではBigIntが文字列としてシリアライズされるため、
 * フロントエンドで数値に変換する必要がある
 */

/**
 * GraphQL BigInt文字列をBigIntに変換
 * サーバーから来る文字列をBigIntに変換（ドメイン層での計算用）
 * 
 * @param value - GraphQL BigInt値（文字列、数値、またはBigInt）
 * @param defaultValue - 変換できない場合のデフォルト値
 * @returns 変換されたBigIntまたはデフォルト値
 * 
 * @example
 * parseGraphQLBigInt("100") // 100n
 * parseGraphQLBigInt(100) // 100n
 * parseGraphQLBigInt(BigInt(100)) // 100n
 * parseGraphQLBigInt(null) // 0n
 * parseGraphQLBigInt("", 10n) // 10n
 */
export function parseGraphQLBigInt(
  value: string | number | bigint | null | undefined,
  defaultValue: bigint = 0n
): bigint {
  if (value === null || value === undefined || value === '') {
    return defaultValue;
  }
  
  try {
    if (typeof value === 'bigint') {
      return value;
    }
    if (typeof value === 'string') {
      return BigInt(value);
    }
    if (typeof value === 'number') {
      return BigInt(Math.floor(value));
    }
  } catch (error) {
    console.warn('[BigInt] Invalid BigInt value:', value, error);
    return defaultValue;
  }
  
  return defaultValue;
}

/**
 * BigIntを安全に数値に変換（UI表示用）
 * オーバーフロー警告付き
 * 
 * @param value - BigInt値
 * @param defaultValue - 変換できない場合のデフォルト値
 * @returns 変換された数値またはデフォルト値
 * 
 * @example
 * bigIntToNumberSafe(100n) // 100
 * bigIntToNumberSafe(null) // 0
 * bigIntToNumberSafe(BigInt(Number.MAX_SAFE_INTEGER + 1)) // 警告を出力して変換
 */
export function bigIntToNumberSafe(
  value: bigint | null | undefined,
  defaultValue: number = 0
): number {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  
  if (value > BigInt(Number.MAX_SAFE_INTEGER)) {
    console.warn('[BigInt] BigInt value exceeds MAX_SAFE_INTEGER, precision may be lost');
  }
  
  return Number(value);
}

/**
 * GraphQL BigInt → number変換（便利なショートカット）
 * UI層で直接使用する場合
 * 
 * @param value - GraphQL BigInt値（文字列、数値、またはBigInt）
 * @param defaultValue - 変換できない場合のデフォルト値
 * @returns 変換された数値またはデフォルト値
 * 
 * @example
 * toPointNumber("100") // 100
 * toPointNumber(gqlWallet?.currentPointView?.currentPoint, 0) // ポイント数値
 */
export function toPointNumber(
  value: string | number | bigint | null | undefined,
  defaultValue: number = 0
): number {
  const bigIntValue = parseGraphQLBigInt(value, BigInt(defaultValue));
  return bigIntToNumberSafe(bigIntValue, defaultValue);
}

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
  value: string | bigint | number | null | undefined,
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
