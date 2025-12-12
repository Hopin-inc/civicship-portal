// PublishStatusField.tsx
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
import { GqlPublishStatus } from "@/types/graphql";
import type { FieldProps } from "./types";

export const PublishStatusField = ({ form }: FieldProps) => (
  <FormField
    control={form.control}
    name="publishStatus"
    render={({ field }) => (
      <FormItem>
        <FormLabel>公開状況 *</FormLabel>
        <Select value={field.value} onValueChange={field.onChange}>
          <FormControl>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            <SelectItem value={GqlPublishStatus.Public}>公開中</SelectItem>
            <SelectItem value={GqlPublishStatus.Private}>下書き</SelectItem>
          </SelectContent>
        </Select>
        <FormDescription>
          「下書き」の募集は公開されず、主催者と運用担当者・管理者のみが閲覧できます。
        </FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);
