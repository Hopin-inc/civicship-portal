"use server";

import { getServerCommunityTransactionsWithCursor } from "./server-community-transactions";
import { getServerWalletTransactionsWithCursor } from "./server-wallet-transactions";
import { GqlTransactionsConnection } from "@/types/graphql";

/**
 * コミュニティのトランザクションを取得するサーバーアクション
 * クライアントコンポーネントから安全に呼び出し可能
 */
export async function fetchMoreCommunityTransactions(
  communityId: string,
  cursor?: string,
  first: number = 20,
): Promise<GqlTransactionsConnection> {
  return getServerCommunityTransactionsWithCursor(communityId, cursor, first);
}

/**
 * ウォレットのトランザクションを取得するサーバーアクション
 * クライアントコンポーネントから安全に呼び出し可能
 */
export async function fetchMoreWalletTransactions(
  walletId: string,
  cursor?: string,
  first: number = 20,
): Promise<GqlTransactionsConnection> {
  return getServerWalletTransactionsWithCursor(walletId, cursor, first);
}
