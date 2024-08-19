"use client";

import { Liff } from "@line/liff";
import { createContext } from "react";

type LiffContextType = {
  liffState: Liff | null;
  liffError: string | null;
};

export const LiffContext = createContext<LiffContextType | undefined>(undefined);
