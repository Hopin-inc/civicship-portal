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
import { COMMUNITY_CREATE } from "@/graphql/mutations/community";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Plus } from "lucide-react";
import React, { useState } from "react";

const FormSchema = z.object({
  name: z.string({
    required_error: "コミュニティ名を入力してください。",
  }),
  pointName: z.string({
    required_error: "ポイント名を入力してください。",
  }),
  bio: z.string().optional(),
  image: z.string().optional(),
  website: z.string().optional(),
  cityCode: z.string({
    required_error: "市コードを入力してください。",
  }),
  stateCode: z.string({
    required_error: "州コードを入力してください。",
  }),
});

const CommunityCreateModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [createCommunity] = useMutation(COMMUNITY_CREATE, {
    fetchPolicy: "no-cache",
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      pointName: "",
      bio: "",
      image: "",
      website: "",
      cityCode: "",
      stateCode: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await createCommunity({
        variables: {
          input: data,
        },
      });
      toast.success("コミュニティを作成しました！");
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
          <DialogTitle>新しいコミュニティを作成</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="grid grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="col-span-12">
                    <FormLabel required>コミュニティ名</FormLabel>
                    <FormControl>
                      <Input placeholder="コミュニティ名を入力してください" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-12 gap-4">
              <FormField
                control={form.control}
                name="pointName"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel required>ポイント名</FormLabel>
                    <FormControl>
                      <Input placeholder="ポイント名を入力してください" {...field} />
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
                name="stateCode"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel required>州コード</FormLabel>
                    <FormControl>
                      <Input placeholder="州コードを入力してください" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem className="col-span-6">
                    <FormLabel>ウェブサイト</FormLabel>
                    <FormControl>
                      <Input placeholder="ウェブサイトを入力してください" {...field} />
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

export default CommunityCreateModal;
