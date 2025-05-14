"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormControl } from "@/components/ui/form";
import { useFormContext } from "react-hook-form";

interface SearchFormProps {
  name?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ name = "searchQuery" }) => {
  const { control } = useFormContext();

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
                className="pl-12 py-6 text-base rounded-2xl"
              />
            </FormControl>
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <svg
                className="w-6 h-6 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </FormItem>
      )}
    />
  );
};

export default SearchForm;
