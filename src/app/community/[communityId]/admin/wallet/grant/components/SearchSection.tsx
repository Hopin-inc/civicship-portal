"use client";

import SearchForm from "@/components/shared/SearchForm";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

interface SearchSectionProps {
  onSearch: (query: string) => void;
}

export function SearchSection({ onSearch }: SearchSectionProps) {
  const t = useTranslations();
  const [input, setInput] = useState("");

  return (
    <SearchForm
      value={input}
      onInputChange={setInput}
      onSearch={onSearch}
      placeholder={t("wallets.shared.search.placeholder")}
    />
  );
}
