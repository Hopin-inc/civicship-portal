"use client";

import { createContext } from "react";

type LoadingContextState = {
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
};

export const LoadingContext = createContext<LoadingContextState | undefined>(undefined);
