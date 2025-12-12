// PriceField.tsx
"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { FieldProps } from "./types";

export const PriceField = ({ form }: FieldProps) => (
  <FormField
    control={form.control}
    name="pricePerPerson"
    render={({ field }) => (
      <FormItem>
        <FormLabel>1人あたりの参加費 *</FormLabel>
        <FormControl>
          <Input type="number" inputMode="numeric" {...field} />
        </FormControl>
        <FormDescription>0の場合は無料として扱われます。</FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);
