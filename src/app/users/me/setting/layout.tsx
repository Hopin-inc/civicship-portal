import React from "react";
import ProtectedLayout from '@/components/auth/ProtectedLayout';
import Header from "./components/Header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout currentPath="/users/me/setting">
      <div className="flex flex-col h-full">
        <Header />
        {children}
      </div>
    </ProtectedLayout>
  );
}
