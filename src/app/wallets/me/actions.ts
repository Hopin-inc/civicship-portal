"use server";

import { cookies } from "next/headers";
import { getServerMyWalletTransactionsWithCursor } from "@/hooks/wallet/server";

/**
 * Server Action: マイウォレットのトランザクションをカーソルベースで取得
 * クライアントコンポーネントから呼び出し可能
 */
export async function fetchMyWalletTransactionsAction(cursor?: string, first: number = 20) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    throw new Error("No session found");
  }

  return getServerMyWalletTransactionsWithCursor(session, cursor, first);
}
