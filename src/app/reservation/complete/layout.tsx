import React from "react";
import { AuthProvider } from "@/contexts/AuthProvider";
import { RouteGuard } from "@/components/auth/RouteGuard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <RouteGuard>{children}</RouteGuard>
    </AuthProvider>
  );
}
