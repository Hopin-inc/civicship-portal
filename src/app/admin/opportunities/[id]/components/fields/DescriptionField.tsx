// DescriptionField.tsx
"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import type { FieldProps } from "./types";

export const DescriptionField = ({ form }: FieldProps) => (
  <FormField
    control={form.control}
    name="description"
    render={({ field }) => (
      <FormItem>
        <FormLabel>詳細</FormLabel>
        <FormControl>
          <Textarea placeholder="例）ABCD1234" className="min-h-[120px]" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
