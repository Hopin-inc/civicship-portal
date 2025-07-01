"use client";

import React, { useState, useEffect } from "react";
import { useHeader } from "@/components/providers/HeaderProvider";
import Header from "@/components/layout/Header";
import BottomBar from "@/components/layout/BottomBar";
import { RouteGuard } from "@/components/auth/RouteGuard";
import AdminBottomBar from "@/components/layout/AdminBottomBar";

interface MainContentProps {
  children: React.ReactNode;
}

const MainContent: React.FC<MainContentProps> = ({ children }) => {
  const { config } = useHeader();
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const baseClassName = "w-full flex-grow pb-16 overflow-y-auto";
  const paddingTop = isClient && config?.hideHeader ? "" : "pt-16";
  const mainClassName = `${baseClassName} ${paddingTop}`;

  return (
    <div className="min-h-screen flex flex-col max-w-mobile-l mx-auto w-full">
      <Header />
      <main className={mainClassName}>
        <RouteGuard>
          {children}
        </RouteGuard>
      </main>
      <BottomBar className="fixed bottom-0 left-0 right-0 z-50 max-w-mobile-l mx-auto w-full" />
      <AdminBottomBar className="fixed bottom-0 left-0 right-0 z-50 max-w-mobile-l mx-auto w-full" />
    </div>
  );
};

export default MainContent;
