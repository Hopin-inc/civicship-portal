// PlaceField.tsx
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
import type { PlaceFieldProps } from "./types";

export const PlaceField = ({ form, places }: PlaceFieldProps) => (
  <FormField
    control={form.control}
    name="placeId"
    render={({ field }) => (
      <FormItem>
        <FormLabel>開催場所</FormLabel>
        <Select value={field.value ?? ""} onValueChange={(v) => field.onChange(v || null)}>
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="未選択" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {places.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormDescription>
          開催場所を追加・編集する場合は、場所マスタ管理画面から行ってください。
        </FormDescription>
        <FormMessage />
      </FormItem>
    )}
  />
);
