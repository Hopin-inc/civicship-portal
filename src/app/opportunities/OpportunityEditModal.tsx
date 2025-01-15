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
import { GET_OPPORTUNITY } from "@/graphql/queries/opportunity";
import { UPDATE_OPPORTUNITY } from "@/graphql/mutations/opportunity";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useEffect, useState } from "react";

import { OpportunityCategory } from "@/gql/graphql";
import { DialogTrigger } from "@radix-ui/react-dialog";

type Props = {
  id: string;
};

// スキーマは Create で使用したものを継承
const FormSchema = z.object({
  title: z.string({ required_error: "タイトルを入力してください。" }),
  category: z.nativeEnum(OpportunityCategory, {
    required_error: "カテゴリを選択してください。",
  }),
  cityCode: z.string({ required_error: "市コードを入力してください。" }),
  communityId: z.string({ required_error: "コミュニティIDを入力してください。" }),
  pointsPerParticipation: z
    .number({ required_error: "ポイントを入力してください。" })
    .min(1, "ポイントは1以上でなければなりません。"),
});

const OpportunityEditModal: React.FC<Props> = ({ id }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { data, loading } = useQuery(GET_OPPORTUNITY, {
    variables: { id },
    fetchPolicy: "no-cache",
  });

  const [updateOpportunity] = useMutation(UPDATE_OPPORTUNITY, {
    fetchPolicy: "no-cache",
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      category: undefined,
      cityCode: "",
      communityId: "",
      pointsPerParticipation: undefined,
    },
  });

  useEffect(() => {
    if (data?.opportunity) {
      form.reset({
        title: data.opportunity.title,
        category: data.opportunity.category,
        cityCode: data.opportunity.city?.code || "",
        communityId: data.opportunity.community?.id || "",
        pointsPerParticipation: data.opportunity.pointsPerParticipation || undefined,
      });
    }
  }, [data, form]);

  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    try {
      await updateOpportunity({
        variables: {
          id,
          input: formData,
        },
      });
      toast.success("保存が完了しました！");
      setIsOpen(false);
    } catch (error) {
      toast.error("保存中にエラーが発生しました。");
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
          <DialogTitle>オポチュニティ編集</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>タイトル</FormLabel>
                  <FormControl>
                    <Input placeholder="タイトルを入力してください" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel required>カテゴリ</FormLabel>
                  <Select
                    value={field.value || ""}
                    onValueChange={(value) => field.onChange(value as OpportunityCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="カテゴリを選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CONVERSATION">会話</SelectItem>
                      <SelectItem value="EVENT">イベント</SelectItem>
                      <SelectItem value="TASK">タスク</SelectItem>
                    </SelectContent>
                  </Select>
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
              name="pointsPerParticipation"
              render={({ field }) => (
                <FormItem>
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

export default OpportunityEditModal;