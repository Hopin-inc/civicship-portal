"use client";

import { createContext, useContext } from "react";
import { AppTransaction } from "../data/type";

export interface WalletContextValue {
  walletId: string;
  userId?: string;
  currentPoint: number;
  transactions: AppTransaction[];
  hasNextPage: boolean;
  isLoadingWallet: boolean;
  isLoadingTransactions: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  loadMore: () => Promise<void>;
}

export const WalletContext = createContext<WalletContextValue | null>(null);

export function useWalletContext() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWalletContext must be used within WalletProvider");
  }
  return context;
}
