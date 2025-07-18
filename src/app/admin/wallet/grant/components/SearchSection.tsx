"use client";

import SearchForm from "@/components/shared/SearchForm";
import React, { useState } from "react";

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
      placeholder="名前・DIDを入力してください"
    />
  );
}