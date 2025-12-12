// HostUserField.tsx
"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { HostUserFieldProps } from "./types";

export const HostUserField = ({ form, hosts }: HostUserFieldProps) => (
  <FormField
    control={form.control}
    name="hostUserId"
    render={({ field }) => (
      <FormItem>
        <FormLabel>主催者 *</FormLabel>
        <Select value={field.value} onValueChange={field.onChange}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="未選択" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {hosts.map((h) => (
              <SelectItem key={h.id} value={h.id}>
                {h.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormDescription>
          「運用担当者」の権限を持つユーザーがここに表示されます。該当者が表示されない場合は、LINE公式アカウントの管理画面から権限を付与してください。
        </FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);
