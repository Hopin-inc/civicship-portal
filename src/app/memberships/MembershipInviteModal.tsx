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
import { MEMBERSHIP_INVITE } from "@/graphql/mutations/membership";
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
import { Role } from "@/gql/graphql";

const FormSchema = z.object({
  communityId: z.string({
    required_error: "コミュニティIDを入力してください。",
  }),
  userId: z.string({
    required_error: "ユーザーIDを入力してください。",
  }),
  role: z.nativeEnum(Role, {
    required_error: "役割を選択してください。",
  }),
});

const MembershipInviteModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inviteMembership] = useMutation(MEMBERSHIP_INVITE, {
    fetchPolicy: "no-cache",
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      communityId: "",
      userId: "",
      role: Role.Member,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      await inviteMembership({
        variables: {
          input: data,
        },
      });
      toast.success("メンバーを招待しました！");
      setIsOpen(false);
    } catch (error) {
      toast.error("招待中にエラーが発生しました。");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus />
          招待
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>新しいメンバーを招待</DialogTitle>
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
            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
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
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>役割</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="border rounded-md px-2 py-1 w-full"
                    >
                      {Object.values(Role).map((role) => (
                        <option key={role} value={role}>
                          {role === Role.Member ? "メンバー" : role === Role.Manager ? "マネージャー" : "オーナー"}
                        </option>
                      ))}
                    </select>
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

export default MembershipInviteModal;
