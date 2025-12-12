// CapacityField.tsx
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

export const CapacityField = ({ form }: FieldProps) => (
  <FormField
    control={form.control}
    name="capacity"
    render={({ field }) => (
      <FormItem>
        <FormLabel>定員 *</FormLabel>
        <FormControl>
          <Input type="number" inputMode="numeric" {...field} />
        </FormControl>
        <FormDescription>1開催枠あたりの参加人数の上限を入力してください。</FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);
