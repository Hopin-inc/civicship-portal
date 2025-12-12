// RequireApprovalField.tsx
"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import type { FieldProps } from "./types";

export const RequireApprovalField = ({ form }: FieldProps) => (
  <FormField
    control={form.control}
    name="requireHostApproval"
    render={({ field }) => (
      <FormItem className="flex items-center justify-between gap-4 py-2">
        <div>
          <FormLabel>主催者からの承認 *</FormLabel>
          <FormDescription>参加には主催者の承認が必要かどうかを設定します。</FormDescription>
        </div>
        <FormControl>
          <Switch checked={field.value} onCheckedChange={field.onChange} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);
