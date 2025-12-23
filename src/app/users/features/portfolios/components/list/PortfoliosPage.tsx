"use client";
import { PortfolioTabs } from "./PortfolioTabs";
import { PortfolioTab } from "../../types";
import { useState } from "react";
import SearchForm from "@/components/shared/SearchForm";
import { FutureTab } from "./FutureTab";
import { PastTab } from "./PastTab";
import { useTranslations } from "next-intl";

export function PortfoliosPage() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<PortfolioTab>(PortfolioTab.Future);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [input, setInput] = useState<string>("");

  return (
    <div className="py-6">
      <PortfolioTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="mt-4">
        <SearchForm
          value={input}
          onInputChange={setInput}
          onSearch={setSearchQuery}
          placeholder={t("users.portfolio.search.placeholder")}
        />
      </div>
      {activeTab === PortfolioTab.Future && <FutureTab searchQuery={searchQuery} />}
      {activeTab === PortfolioTab.Past && <PastTab searchQuery={searchQuery} />}
    </div>
  );
}
