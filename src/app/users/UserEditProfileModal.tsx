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
import { GET_USER } from "@/graphql/queries/user";
import { USER_UPDATE_PROFILE } from "@/graphql/mutations/user";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import React, { useEffect, useState } from "react";

type Props = {
  id: string;
};

const FormSchema = z.object({
  name: z.string({ required_error: "名前を入力してください。" }),
  slug: z.string().optional(),
  image: z
    .object({
      base64: z.string({ required_error: "画像データを入力してください。" }),
    })
    .optional(),
  bio: z.string().optional(),
  urlWebsite: z.string().optional(),
  urlX: z.string().optional(),
  urlFacebook: z.string().optional(),
  urlInstagram: z.string().optional(),
  urlYoutube: z.string().optional(),
  urlTiktok: z.string().optional(),
});

const UserEditProfileModal: React.FC<Props> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data, loading } = useQuery(GET_USER, {
    variables: { id },
    fetchPolicy: "no-cache",
  });

  const [updateUserProfile] = useMutation(USER_UPDATE_PROFILE, {
    fetchPolicy: "no-cache",
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      slug: "",
      image: undefined,
      bio: "",
      urlWebsite: "",
      urlX: "",
      urlFacebook: "",
      urlInstagram: "",
      urlYoutube: "",
      urlTiktok: "",
    },
  });

  useEffect(() => {
    if (data?.user) {
      form.reset({
        name: data.user.name || "",
        slug: data.user.slug || "",
        image: data.user.image ? { base64: data.user.image } : undefined,
        bio: data.user.bio || "",
        urlWebsite: data.user.urlWebsite || "",
        urlX: data.user.urlX || "",
        urlFacebook: data.user.urlFacebook || "",
        urlInstagram: data.user.urlInstagram || "",
        urlYoutube: data.user.urlYoutube || "",
        urlTiktok: data.user.urlTiktok || "",
      });
    }
  }, [data, form]);

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    try {
      await updateUserProfile({
        variables: {
          id,
          input: formData,
        },
      });
      toast.success("プロフィールを更新しました！");
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
          <DialogTitle>プロフィール編集</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>名前</FormLabel>
                  <FormControl>
                    <Input placeholder="名前を入力してください" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>スラッグ</FormLabel>
                  <FormControl>
                    <Input placeholder="スラッグを入力してください" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>画像</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="画像のBase64データを入力してください"
                      value={field.value?.base64 || ""}
                      onChange={(e) => {
                        const base64 = e.target.value;
                        field.onChange(base64 ? { base64 } : undefined);
                      }}
                    />
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
              name="urlWebsite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ウェブサイト</FormLabel>
                  <FormControl>
                    <Input placeholder="ウェブサイトURLを入力してください" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* その他のフィールドを追加 */}
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

export default UserEditProfileModal;
