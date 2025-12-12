// CategoryField.tsx
"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CategoryFieldProps } from "./types";

export const CategoryField = ({ form, categories }: CategoryFieldProps) => (
  <FormField
    control={form.control}
    name="category"
    render={({ field }) => (
      <FormItem>
        <FormLabel>カテゴリ *</FormLabel>
        <Select value={field.value} onValueChange={field.onChange}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="カテゴリを選択" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {categories.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormMessage />
      </FormItem>
    )}
  />
);
