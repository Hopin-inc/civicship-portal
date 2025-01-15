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
import { useMutation } from "@apollo/client";
import { toast } from "sonner";
import { CREATE_OPPORTUNITY } from "@/graphql/mutations/opportunity";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import { OpportunityCategory } from "@/gql/graphql";

const FormSchema = z.object({
  title: z.string({
    required_error: "タイトルを入力してください。",
  }),
  category: z.nativeEnum(OpportunityCategory, {
    required_error: "カテゴリを選択してください。",
  }),
  cityCode: z.string({
    required_error: "市コードを入力してください。",
  }),
  communityId: z.string({
    required_error: "コミュニティIDを入力してください。",
  }),
  pointsPerParticipation: z
    .number({
      required_error: "ポイントを入力してください。",
    })
    .min(1, "ポイントは1以上でなければなりません。"),
});

const OpportunityCreateModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [createOpportunity] = useMutation(CREATE_OPPORTUNITY, {
    fetchPolicy: "no-cache",
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      category: OpportunityCategory.Conversation,
      cityCode: "",
      communityId: "",
      pointsPerParticipation: 10,
      title: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await createOpportunity({
        variables: {
          input: data,
        },
      });
      toast.success("新規作成完了!");
      setIsOpen(false);
    } catch (error) {
      toast.error("作成中にエラーが発生しました。");
    }
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
          <DialogTitle>新しい募集を作成</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-12">
                    <FormLabel required>タイトル</FormLabel>
                    <FormControl>
                      <Input placeholder="タイトルを入力してください" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel required>カテゴリ</FormLabel>
                    <FormControl>
                      <select
                        {...field}
                        className="w-full border rounded-md px-3 py-2"
                      >
                        <option value="" disabled>
                          カテゴリを選択してください
                        </option>
                        <option value="CONVERSATION">会話</option>
                        <option value="EVENT">イベント</option>
                        <option value="TASK">タスク</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cityCode"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel required>市コード</FormLabel>
                    <FormControl>
                      <Input placeholder="市コードを入力してください" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="communityId"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel required>コミュニティID</FormLabel>
                    <FormControl>
                      <Input placeholder="コミュニティIDを入力してください" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pointsPerParticipation"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel required>ポイント</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="ポイントを入力してください"
                        {...field}
                      />
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

export default OpportunityCreateModal;
