"use client";

import { createContext, ReactNode, useCallback, useContext, useState } from "react";
import { toPointNumber } from "@/utils/bigint";
import { logger } from "@/lib/logging";
import { useGetWalletByIdQuery } from "@/types/graphql";

export interface WalletContextValue {
  walletId: string;
  userId?: string;
  currentPoint: number;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export interface WalletProviderProps {
  children: ReactNode;
  walletId: string;
  userId?: string;
  initialCurrentPoint: number;
}

export function WalletProvider({
  children,
  walletId,
  userId,
  initialCurrentPoint,
}: WalletProviderProps) {
  const [currentPoint, setCurrentPoint] = useState(initialCurrentPoint);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { refetch } = useGetWalletByIdQuery({
    variables: { id: walletId },
    skip: true,
  });

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await refetch();
      const wallet = data?.wallet;
      if (wallet) {
        const pointString = wallet.currentPointView?.currentPoint;
        setCurrentPoint(toPointNumber(pointString, 0));
      }
    } catch (err) {
      logger.error("Failed to refresh wallet", {
        error: err instanceof Error ? err.message : String(err),
        component: "WalletProvider",
      });
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsLoading(false);
    }
  }, [refetch]);

  const value: WalletContextValue = {
    walletId,
    userId,
    currentPoint,
    isLoading,
    error,
    refresh,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWalletContext must be used within WalletProvider");
  return context;
}
