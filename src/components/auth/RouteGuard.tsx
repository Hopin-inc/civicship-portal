"use client";

import React from "react";
import { usePathname, useSearchParams } from "next/navigation";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

interface RouteGuardProps {
  children: React.ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({ children }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isLiffCallback =
    (pathname === "/" || pathname === "/login") &&
    searchParams.has("code") &&
    searchParams.has("state") &&
    searchParams.has("liffClientId");

  if (isLiffCallback) {
    return <LoadingIndicator />;
  }

  return <>{children}</>;
};
