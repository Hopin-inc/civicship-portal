"use client";

import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_WALLET_BY_ID } from "@/graphql/account/wallet/query";
import { GqlWalletType } from "@/types/graphql";
import { toPointNumber } from "@/utils/bigint";
import { logger } from "@/lib/logging";

export interface WalletContextValue {
  walletId: string;
  userId?: string;
  currentPoint: number;
  walletType: 'MEMBER' | 'COMMUNITY';
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export interface WalletProviderProps {
  children: ReactNode;
  walletId: string;
  userId?: string;
  initialCurrentPoint?: number;
  initialWalletType?: 'MEMBER' | 'COMMUNITY';
}

export function WalletProvider({
  children,
  walletId,
  userId,
  initialCurrentPoint = 0,
  initialWalletType = 'MEMBER',
}: WalletProviderProps) {
  const searchParams = useSearchParams();
  const shouldRefresh = searchParams.get("refresh") === "true";

  const [currentPoint, setCurrentPoint] = useState<number>(initialCurrentPoint);
  const [walletType, setWalletType] = useState<'MEMBER' | 'COMMUNITY'>(initialWalletType);
  const [error, setError] = useState<Error | null>(null);

  const {
    data: walletData,
    loading,
    refetch: refetchWalletQuery,
  } = useQuery(GET_WALLET_BY_ID, {
    variables: { id: walletId },
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (walletData?.wallet) {
      const wallet = walletData.wallet;
      const pointString = wallet.currentPointView?.currentPoint;
      setCurrentPoint(toPointNumber(pointString, 0));
      setWalletType(wallet.type === GqlWalletType.Community ? 'COMMUNITY' : 'MEMBER');
    }
  }, [walletData]);

  const refresh = useCallback(async () => {
    try {
      await refetchWalletQuery();
    } catch (err) {
      logger.error("Failed to refresh wallet", {
        error: err instanceof Error ? err.message : String(err),
        component: "WalletProvider",
      });
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [refetchWalletQuery]);

  useEffect(() => {
    if (shouldRefresh) {
      const refreshData = async () => {
        try {
          await refresh();
          const url = new URL(window.location.href);
          url.searchParams.delete("refresh");
          window.history.replaceState({}, "", url);
        } catch (err) {
          logger.error("Refresh failed after redirect", {
            error: err instanceof Error ? err.message : String(err),
            component: "WalletProvider",
          });
        }
      };
      refreshData();
    }
  }, [shouldRefresh, refresh]);

  useEffect(() => {
    const handleFocus = async () => {
      try {
        await refresh();
      } catch (err) {
        logger.error("Refetch failed on window focus", {
          error: err instanceof Error ? err.message : String(err),
          component: "WalletProvider",
        });
      }
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refresh]);

  const value: WalletContextValue = {
    walletId,
    userId,
    currentPoint,
    walletType,
    isLoading: loading,
    error,
    refresh,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within WalletProvider");
  }
  return context;
}
