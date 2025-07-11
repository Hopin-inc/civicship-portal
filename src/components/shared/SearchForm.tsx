"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchFormProps {
  value: string;
  onInputChange: (v: string) => void;
  onSearch: (v: string) => void;
  placeholder: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ value, onInputChange, onSearch, placeholder }) => {
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();
    onSearch(value);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(value);
    }
  };
  return (
    <div className="relative">
      <Input
        value={value}
        onChange={e => onInputChange(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="pl-12 py-6 text-body-md rounded-xl text-base min-h-[48px]"
      />
      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
        <Search className="w-4 h-4 text-muted-foreground" />
      </div>
    </div>
  );
};

export default SearchForm;
