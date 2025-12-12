// PointField.tsx
"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { FieldProps } from "./types";

export const PointField = ({ form }: FieldProps) => (
  <FormField
    control={form.control}
    name="pointPerPerson"
    render={({ field }) => (
      <FormItem>
        <FormLabel>1人あたりの参加ポイント</FormLabel>
        <FormControl>
          <Input type="number" inputMode="numeric" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
