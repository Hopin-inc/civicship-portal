"use client";

import { useGetMyWalletBalanceQuery } from "@/types/graphql";
import { useAuthStore } from "@/lib/auth/core/auth-store";

export function useMyWalletBalance() {
  const hasAuth = useAuthStore((s) => !!s.state.firebaseUser || !!s.state.lineTokens.idToken);

  const { data, loading, error, refetch } = useGetMyWalletBalanceQuery({
    fetchPolicy: "network-only",
    nextFetchPolicy: "network-only",
    skip: !hasAuth,
  });

  const currentPoint = BigInt(data?.myWallet?.currentPointView?.currentPoint ?? "0");

  return { currentPoint, loading, error, refetch };
}
