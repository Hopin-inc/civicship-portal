"use client";

import { ReactNode } from "react";
import { AuthInteractionProvider } from "@/contexts/AuthInteractionProvider";

export function AuthFlowClientWrapper({ children }: { children: ReactNode }) {
  return (
    <AuthInteractionProvider>
      {children}
    </AuthInteractionProvider>
  );
}
