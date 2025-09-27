import React from "react";
import ProtectedLayout from '@/components/auth/ProtectedLayout';
import { metadata } from "./metadata";

export { metadata };

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout currentPath="/search/result">
      {children}
    </ProtectedLayout>
  );
}
