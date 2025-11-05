"use server";

import { getServerCommunityTransactionsWithCursor } from "@/hooks/transactions/server-community-transactions";

export async function fetchMoreTransactionsAction(cursor?: string, first: number = 20) {
  return getServerCommunityTransactionsWithCursor(cursor, first);
}
