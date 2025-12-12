// SlotsField.tsx
"use client";

import { useWatch } from "react-hook-form";
import dayjs from "dayjs";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { FieldProps } from "./types";

export const SlotsField = ({ form }: FieldProps) => {
  const slots = useWatch({ control: form.control, name: "slots" });

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">開催枠</h2>
      {slots?.map((slot, index) => (
        <div key={index} className="space-y-2 rounded-xl border p-4">
          <FormField
            control={form.control}
            name={`slots.${index}.startAt`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>開始日時</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                {field.value && (
                  <FormDescription>実際に送られる値: {dayjs(field.value).unix()}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`slots.${index}.endAt`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>終了日時</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                {field.value && (
                  <FormDescription>実際に送られる値: {dayjs(field.value).unix()}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="tertiary"
        className="w-full py-4"
        onClick={() => form.setValue("slots", [...slots, { startAt: "", endAt: "" }])}
      >
        開催枠を追加
      </Button>
    </div>
  );
};
