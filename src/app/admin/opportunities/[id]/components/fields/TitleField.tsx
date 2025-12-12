// app/admin/opportunities/[id]/components/fields/TitleField.tsx
"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { FieldProps } from "./types";

export const TitleField = ({ form }: FieldProps) => (
  <FormField
    control={form.control}
    name="title"
    render={({ field }) => (
      <FormItem>
        <FormLabel>タイトル *</FormLabel>
        <FormControl>
          <Input placeholder="例）ABCD1234" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
