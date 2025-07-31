"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

interface SearchFormProps {
  name?: string;
  onSearch?: () => void;
  redirectTo?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ name = "searchQuery", onSearch, redirectTo }) => {
  const { control, getValues } = useFormContext();
  const router = useRouter();

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (onSearch) {
        onSearch();
      } else if (redirectTo) {
        const value = getValues(name);
        const params = new URLSearchParams();
        if (value) params.set(name, value);
        router.push(`${redirectTo}?${params.toString()}`);
      }
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
