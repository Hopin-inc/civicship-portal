// SummaryField.tsx
"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { FieldProps } from "./types";

export const SummaryField = ({ form }: FieldProps) => (
  <FormField
    control={form.control}
    name="summary"
    render={({ field }) => (
      <FormItem>
        <FormLabel>概要 *</FormLabel>
        <FormControl>
          <Textarea placeholder="例）ABCD1234" className="min-h-[80px]" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
