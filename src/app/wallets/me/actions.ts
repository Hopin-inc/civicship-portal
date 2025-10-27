"use server";

import { cookies } from "next/headers";
import { getServerMyWalletWithTransactions } from "@/hooks/wallet/server";

/**
 * Server Action: マイウォレット情報とトランザクションを統合取得（refresh用）
 * WalletProviderのrefresh用
 */
export async function refreshMyWalletWithTransactionsAction() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    throw new Error("No session found");
  }

  const result = await getServerMyWalletWithTransactions(session, { first: 20 });

  if (!result.wallet) {
    throw new Error("Failed to fetch wallet");
  }

  return {
    id: result.wallet.id,
    currentPoint: result.wallet.currentPoint.toString(),
    accumulatedPoint: result.wallet.accumulatedPoint.toString(),
    transactions: result.transactions,
  };
}

/**
 * Server Action: マイウォレットのトランザクションをカーソルベースで取得（pagination用）
 * 統合クエリを使用し、transactionsのみを返す
 */
export async function fetchMyWalletTransactionsAction(cursor?: string, first: number = 20) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    throw new Error("No session found");
  }

  const result = await getServerMyWalletWithTransactions(session, { first, after: cursor });

  return result.transactions;
}
