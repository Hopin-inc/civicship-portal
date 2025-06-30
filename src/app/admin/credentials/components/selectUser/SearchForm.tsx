"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchFormProps {
  value: string;
  onInputChange: (v: string) => void;
  onSearch: (v: string) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ value, onInputChange, onSearch }) => {
  const handleBlur = () => {
    onSearch(value);
  };
  return (
    <div className="relative">
      <Input
        value={value}
        onChange={e => onInputChange(e.target.value)}
        onBlur={handleBlur}
        placeholder="名前・DIDで検索"
        className="pl-12 py-6 text-body-md rounded-xl text-base min-h-[48px]"
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );
};

export default SearchForm;
