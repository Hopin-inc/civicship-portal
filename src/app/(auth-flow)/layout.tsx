"use client";

import { ReactNode } from "react";
import { AuthInteractionProvider } from "@/contexts/AuthInteractionProvider";

export default function AuthFlowLayout({ children }: { children: ReactNode }) {
  return (
    <AuthInteractionProvider>
      {children}
    </AuthInteractionProvider>
  );
}
