"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Search } from "lucide-react";

interface SearchFormProps {
  name?: string;
  onSearch?: () => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ name = "searchQuery", onSearch }) => {
  const { control } = useFormContext();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && onSearch) {
      event.preventDefault();
      onSearch();
    }
  };

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="relative">
            <FormControl>
              <Input
                {...field}
                placeholder="検索ワードを入力"
                className="pl-12 py-6 text-body-md rounded-xl text-base min-h-[48px]"
                onKeyDown={handleKeyDown}
              />
            </FormControl>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};

export default SearchForm;
