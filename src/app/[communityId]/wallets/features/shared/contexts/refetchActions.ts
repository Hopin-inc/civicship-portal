"use server";

import { headers } from "next/headers";
import { getServerMyWalletWithTransactions } from "@/app/[communityId]/wallets/features/shared/server/getServerMyWalletWithTransactions";

/**
 * Server Action: マイウォレット情報とトランザクションを統合取得
 * refresh用とpagination用の両方で使用される統一アクション
 * 
 * @param cursor - ページネーション用のカーソル（オプション）
 * @param first - 取得するトランザクション数（デフォルト: 20）
 * @returns wallet情報とtransactionsを含むオブジェクト
 */
export async function fetchMyWalletWithTransactionsAction(cursor?: string, first: number = 20) {
  // Get communityId from request headers (set by middleware)
  const headersList = await headers();
  const communityId = headersList.get("x-community-id") || undefined;
  
  const result = await getServerMyWalletWithTransactions({ first, after: cursor, communityId });

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
