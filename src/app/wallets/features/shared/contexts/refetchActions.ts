"use server";

import { getServerMyWalletWithTransactions } from "@/app/wallets/features/shared/server/getServerMyWalletWithTransactions";
import { headers, cookies } from "next/headers";

/**
 * Server Action: マイウォレット情報とトランザクションを統合取得
 * refresh用とpagination用の両方で使用される統一アクション
 * 
 * @param cursor - ページネーション用のカーソル（オプション）
 * @param first - 取得するトランザクション数（デフォルト: 20）
 * @returns wallet情報とtransactionsを含むオブジェクト
 */
export async function fetchMyWalletWithTransactionsAction(cursor?: string, first: number = 20) {
  // Get communityId from request headers (set by middleware) or cookies
  const headersList = await headers();
  const cookieStore = await cookies();
  const communityId = headersList.get("x-community-id") || cookieStore.get("communityId")?.value || "";
  
  const result = await getServerMyWalletWithTransactions({ communityId, first, after: cursor });

  if (!result.wallet) {
    throw new Error("No wallet found - session may be invalid");
  }

  return {
    wallet: result.wallet ? {
      id: result.wallet.id,
      currentPoint: result.wallet.currentPoint.toString(),
      accumulatedPoint: result.wallet.accumulatedPoint.toString(),
    } : null,
    transactions: result.transactions,
  };
}
