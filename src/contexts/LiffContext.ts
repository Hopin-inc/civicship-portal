"use client";

import { Liff } from "@line/liff";
import { createContext } from "react";

type LiffContextState = {
  liffState: Liff | null;
  liffError: string | null;
};

export const LiffContext = createContext<LiffContextState | undefined>(undefined);
