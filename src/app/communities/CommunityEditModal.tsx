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
import { GET_COMMUNITY } from "@/graphql/queries/community";
import { COMMUNITY_UPDATE_PROFILE } from "@/graphql/mutations/community";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { useEffect, useState } from "react";
import { DialogTrigger } from "@radix-ui/react-dialog";

type Props = {
  id: string;
};

const FormSchema = z.object({
  name: z.string({ required_error: "コミュニティ名を入力してください。" }),
  pointName: z.string({ required_error: "ポイント名を入力してください。" }),
  bio: z.string().optional(),
  image: z.string().optional(),
  website: z.string().optional(),
  cityCode: z.string({ required_error: "市コードを入力してください。" }),
});

const CommunityEditModal: React.FC<Props> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data, loading } = useQuery(GET_COMMUNITY, {
    variables: { id },
    fetchPolicy: "no-cache",
  });

  const [updateCommunity] = useMutation(COMMUNITY_UPDATE_PROFILE, {
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
    },
  });

  useEffect(() => {
    if (data?.community) {
      form.reset({
        name: data.community.name,
        pointName: data.community.pointName,
        bio: data.community.bio || "",
        image: data.community.image || "",
        website: data.community.website || "",
        cityCode: data.community.city?.code || "",
      });
    }
  }, [data, form]);

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    try {
      await updateCommunity({
        variables: {
          id,
          input: formData,
        },
      });
      toast.success("コミュニティ情報を更新しました！");
      setIsOpen(false);
    } catch (error) {
      toast.error("更新中にエラーが発生しました。");
    }
  };

  if (loading) {
    return <p>データを読み込んでいます...</p>;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">編集</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>コミュニティ編集</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>コミュニティ名</FormLabel>
                  <FormControl>
                    <Input placeholder="コミュニティ名を入力してください" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pointName"
              render={({ field }) => (
                <FormItem>
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
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>説明</FormLabel>
                  <FormControl>
                    <Input placeholder="説明を入力してください" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cityCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>市コード</FormLabel>
                  <FormControl>
                    <Input placeholder="市コードを入力してください" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex gap-2">
              <Button type="submit">保存</Button>
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

export default CommunityEditModal;
