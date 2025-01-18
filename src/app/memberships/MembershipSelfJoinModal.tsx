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
import { MEMBERSHIP_SELF_JOIN } from "@/graphql/mutations/membership";
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
  communityId: z.string({
    required_error: "コミュニティIDを入力してください。",
  }),
});

const MembershipSelfJoinModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [createMembership] = useMutation(MEMBERSHIP_SELF_JOIN, {
    fetchPolicy: "no-cache",
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      communityId: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await createMembership({
        variables: {
          input: data,
        },
      });
      toast.success("メンバーシップを作成しました！");
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
          <DialogTitle>新しいメンバーシップを作成</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="communityId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>コミュニティID</FormLabel>
                  <FormControl>
                    <Input placeholder="コミュニティIDを入力してください" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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

export default MembershipSelfJoinModal;
