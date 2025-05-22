"use client";

import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import MembershipTestSection from "./components/MembershipTestSection";
import TransactionTestSection from "./components/TransactionTestSection";
import useHeaderConfig from "@/hooks/useHeaderConfig";

export default function GraphQLTestPage() {
  const [activeTab, setActiveTab] = useState<"membership" | "transaction">("membership");
  
  const headerConfig = useMemo(() => ({
    title: "GraphQL Test Environment",
    showBackButton: true,
    showLogo: false,
  }), []);
  
  useHeaderConfig(headerConfig);

  return (
    <div className="flex flex-col min-h-screen bg-background p-4">
      <h1 className="text-2xl font-bold mb-4">GraphQL Test Environment</h1>
      
      <div className="flex space-x-2 mb-6">
        <Button
          variant={activeTab === "membership" ? "primary" : "secondary"}
          onClick={() => setActiveTab("membership")}
        >
          Membership
        </Button>
        <Button
          variant={activeTab === "transaction" ? "primary" : "secondary"}
          onClick={() => setActiveTab("transaction")}
        >
          Transaction
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === "membership" ? (
          <MembershipTestSection />
        ) : (
          <TransactionTestSection />
        )}
      </div>
    </div>
  );
}
