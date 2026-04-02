"use client";

import { useQuery } from "@apollo/client";
import { GET_MY_WALLET_BALANCE } from "@/graphql/account/wallet/query";
import { useAuthStore } from "@/lib/auth/core/auth-store";

export function useMyWalletBalance() {
  const hasAuth = useAuthStore((s) => !!s.state.firebaseUser || !!s.state.lineTokens.idToken);

  const { data, loading, error, refetch } = useQuery(GET_MY_WALLET_BALANCE, {
    fetchPolicy: "network-only",
    skip: !hasAuth,
  });

  const currentPoint = BigInt(data?.myWallet?.currentPointView?.currentPoint ?? "0");

  return { currentPoint, loading, error, refetch };
}
