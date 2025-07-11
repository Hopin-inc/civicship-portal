"use client";

import React, { useState } from "react";
import SearchForm from "@/components/shared/SearchForm";

interface SearchSectionProps {
  onSearch: (query: string) => void;
}

export function SearchSection({ onSearch }: SearchSectionProps) {
  const [input, setInput] = useState("");

  return (
    <SearchForm 
      value={input}
      onInputChange={setInput}
      onSearch={onSearch} 
      placeholder={"名前・DIDで検索"}    />
  );
}