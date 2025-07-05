"use client";

import React, { useState } from "react";
import SearchForm from "@/app/admin/credentials/components/selectUser/SearchForm";

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
    />
  );
} 