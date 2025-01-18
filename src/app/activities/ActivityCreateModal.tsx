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
} from "@/app/_components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/app/_components/ui/input";
import { Button } from "@/app/_components/ui/button";
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import dayjs from "dayjs";
import { CREATE_ACTIVITY } from "@/graphql/mutations/activity";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/app/_components/ui/dialog";
import DateTimePicker from "@/app/_components/elements/DateTimePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

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

const ActivityCreateModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [createActivity] = useMutation(CREATE_ACTIVITY, {
    fetchPolicy: "no-cache",
  });
  const defaultDate = dayjs(dayjs().format("YYYY-MM-DD")).set("hour", 12).set("minute", 0).toDate();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: undefined,
      remark: undefined,
      startsAt: defaultDate,
      endsAt: defaultDate,
      userId: undefined,
      eventId: undefined,
      isPublic: true,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    await createActivity({
      variables: {
        input: data,
      },
    });
    toast.success("新規作成完了!");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus />
          新規作成
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>活動の新規登録</DialogTitle>
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
                name="userId"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel required>ユーザーID</FormLabel>
                    <FormControl>
                      <Input placeholder="ユーザーIDを入力してください" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventId"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel>イベントID</FormLabel>
                    <FormControl>
                      <Input placeholder="イベントIDを入力してください" {...field} />
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
              <Button type="submit">送信</Button>
              <DialogClose asChild>
                <Button variant="outline">キャンセル</Button>
              </DialogClose>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityCreateModal;
