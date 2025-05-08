"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import { GET_ACTIVITY } from "@/graphql/queries/activity";
import { UPDATE_ACTIVITY } from "@/graphql/mutations/activity";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import DateTimePicker from "@/app/components/elements/DateTimePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

type Props = {
  id: string;
};

const FormSchema = z
  .object({
    description: z.string({ required_error: "必ず選択してください。" }),
    remark: z.string().optional(),
    startsAt: z.date({ required_error: "必ず選択してください。" }),
    endsAt: z.date({ required_error: "必ず選択してください。" }),
    userId: z.string({ required_error: "必ず選択してください。" }),
    eventId: z.string().optional(),
    isPublic: z.boolean(),
  })
  .partial({
    eventId: true,
  });

const ActivityEditModal: React.FC<Props> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data } = useQuery(GET_ACTIVITY, {
    variables: { id },
    fetchPolicy: "no-cache",
  });
  const [updateActivity] = useMutation(UPDATE_ACTIVITY, {
    fetchPolicy: "no-cache",
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: data?.activity?.description ?? undefined,
      remark: data?.activity?.remark ?? undefined,
      startsAt: data?.activity?.startsAt ?? undefined,
      endsAt: data?.activity?.endsAt ?? undefined,
      userId: data?.activity?.user?.id ?? undefined,
      eventId: data?.activity?.event?.id ?? undefined,
      isPublic: data?.activity?.isPublic ?? undefined,
    },
  });

  useEffect(() => {
    if (data?.activity) {
      form.reset({
        description: data.activity.description || "",
        remark: data.activity.remark || "",
        startsAt: data.activity.startsAt ? new Date(data.activity.startsAt) : undefined,
        endsAt: data.activity.endsAt ? new Date(data.activity.endsAt) : undefined,
        isPublic: data.activity.isPublic || false,
      });
    }
  }, [data, form]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    await updateActivity({
      variables: {
        id,
        input: data,
      },
    });
    toast.success("保存完了!");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          編集
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>活動の編集</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-12">
                    <FormLabel required>説明</FormLabel>
                    <FormControl>
                      <Input placeholder="説明を入力してください" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="startsAt"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel required>開始日時</FormLabel>
                    <FormControl>
                      <DateTimePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endsAt"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel required>終了日時</FormLabel>
                    <FormControl>
                      <DateTimePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel required>公開設定</FormLabel>
                    <Select
                      value={field.value ? "true" : "false"}
                      onValueChange={(value) => field.onChange(value === "true")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="公開設定を選択してください" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">公開</SelectItem>
                        <SelectItem value="false">非公開</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <FormItem className="col-span-12">
                    <FormLabel>備考</FormLabel>
                    <FormControl>
                      <Input placeholder="備考を入力してください" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit">保存</Button>
              <DialogClose asChild>
                <Button variant="secondary">キャンセル</Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityEditModal;
