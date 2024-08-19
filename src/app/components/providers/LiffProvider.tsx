"use client";

import { LiffContext } from "@/contexts/LiffContext";
import liff, { type Liff } from "@line/liff";
import { useState, useEffect, FC, ReactNode } from "react";

const LiffProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [liffState, setliffState] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);

  useEffect(() => {
    liff.init(
      { liffId: process.env.NEXT_PUBLIC_LIFF_ID || "" },
      () => {
        setliffState(liff);
      },
      (error) => {
        console.error("LIFF initialization failed", error);
        setLiffError(error.toString());
      },
    );
  }, []);

  return <LiffContext.Provider value={{ liffState, liffError }}>{children}</LiffContext.Provider>;
};

export default LiffProvider;
