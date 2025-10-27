"use client";

import { createContext, ReactNode, useContext } from "react";
import { GqlTransactionsConnection } from "@/types/graphql";

export interface TransactionsInitialContextValue {
  initialTransactions: GqlTransactionsConnection;
}

const TransactionsInitialContext = createContext<TransactionsInitialContextValue | null>(null);

export interface TransactionsInitialProviderProps {
  children: ReactNode;
  initialTransactions: GqlTransactionsConnection;
}

/**
 * SSRで取得した初期トランザクションデータを提供するProvider
 * Read-onlyコンテキスト（初期データのみ）
 */
export function TransactionsInitialProvider({
  children,
  initialTransactions,
}: TransactionsInitialProviderProps) {
  const value: TransactionsInitialContextValue = {
    initialTransactions,
  };

  return (
    <TransactionsInitialContext.Provider value={value}>
      {children}
    </TransactionsInitialContext.Provider>
  );
}

/**
 * SSRで取得した初期トランザクションデータを取得するhook
 */
export function useTransactionsInitial() {
  const context = useContext(TransactionsInitialContext);
  if (!context) {
    throw new Error("useTransactionsInitial must be used within TransactionsInitialProvider");
  }
  return context;
}
