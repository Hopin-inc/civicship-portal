import React from "react";
import ProtectedLayout from '@/components/auth/ProtectedLayout';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout currentPath="/reservation/select-date">
      {children}
    </ProtectedLayout>
  );
}
