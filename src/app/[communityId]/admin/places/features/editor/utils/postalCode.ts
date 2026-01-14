/**
 * 郵便番号から住所を取得するユーティリティ
 * zipcloud API (無料) を使用
 */

export interface PostalCodeResult {
  address1: string; // 都道府県
  address2: string; // 市区町村
  address3: string; // 町域
  kana1: string; // 都道府県カナ
  kana2: string; // 市区町村カナ
  kana3: string; // 町域カナ
}

interface ZipcloudResponse {
  message: string | null;
  results: PostalCodeResult[] | null;
  status: number;
}

/**
 * 郵便番号から住所を取得する
 *
 * 要件:
 * - 郵便番号検索は、位置情報を取得する目的では使用しない
 * - 緯度経度は地図確定操作でのみ取得する
 *
 * @param postalCode 郵便番号（ハイフンなし7桁）
 * @returns 住所情報、エラー時はnull
 */
export async function fetchAddressByPostalCode(
  postalCode: string
): Promise<PostalCodeResult | null> {
  // 郵便番号の形式チェック（7桁の数字）
  if (!/^\d{7}$/.test(postalCode)) {
    return null;
  }

  try {
    const response = await fetch(
      `https://zipcloud.ibsnet.co.jp/api/search?zipcode=${postalCode}`
    );

    if (!response.ok) {
      return null;
    }

    const data: ZipcloudResponse = await response.json();

    // エラーレスポンスチェック
    if (data.status !== 200 || !data.results || data.results.length === 0) {
      return null;
    }

    // 最初の結果を返す
    return data.results[0];
  } catch (error) {
    console.error("Postal code search error:", error);
    return null;
  }
}

/**
 * 郵便番号検索結果から完全な住所文字列を生成
 *
 * @param result 郵便番号検索結果
 * @returns 完全な住所文字列（例: "岡山県瀬戸内市邑久町尾張"）
 */
export function formatFullAddress(result: PostalCodeResult): string {
  return `${result.address1}${result.address2}${result.address3}`;
}
