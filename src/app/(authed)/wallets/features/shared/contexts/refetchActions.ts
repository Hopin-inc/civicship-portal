"use server";

import { cookies } from "next/headers";
import { getServerMyWalletWithTransactions } from "@/app/(authed)/wallets/features/shared/server/getServerMyWalletWithTransactions";

/**
 * Server Action: マイウォレット情報とトランザクションを統合取得
 * refresh用とpagination用の両方で使用される統一アクション
 * 
 * @param cursor - ページネーション用のカーソル（オプション）
 * @param first - 取得するトランザクション数（デフォルト: 20）
 * @returns wallet情報とtransactionsを含むオブジェクト
 */
export async function fetchMyWalletWithTransactionsAction(cursor?: string, first: number = 20) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    throw new Error("No session found");
  }

  const result = await getServerMyWalletWithTransactions(session, { first, after: cursor });

  return {
    wallet: result.wallet ? {
      id: result.wallet.id,
      currentPoint: result.wallet.currentPoint.toString(),
      accumulatedPoint: result.wallet.accumulatedPoint.toString(),
    } : null,
    transactions: result.transactions,
  };
}
