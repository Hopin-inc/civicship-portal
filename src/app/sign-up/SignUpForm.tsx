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
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CurrentPrefecture, IdentityPlatform } from "@/gql/graphql";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const prefectureLabels: Record<CurrentPrefecture, string> = {
  [CurrentPrefecture.Kagawa]: '香川県',
  [CurrentPrefecture.Tokushima]: '徳島県',
  [CurrentPrefecture.Kochi]: '高知県',
  [CurrentPrefecture.Ehime]: '愛媛県',
  [CurrentPrefecture.OutsideShikoku]: '四国以外',
  [CurrentPrefecture.Unknown]: '不明',
} as const;

const FormSchema = z.object({
  name: z.string({ required_error: "名前を入力してください。" }),
  prefecture: z.nativeEnum(CurrentPrefecture, {
    required_error: "居住地を選択してください。"
  }),
});

type FormValues = z.infer<typeof FormSchema>;

export function SignUpForm() {
  const router = useRouter();
  const { createUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      prefecture: undefined,
    },
  });

  const prefectures = [
    CurrentPrefecture.Kagawa,
    CurrentPrefecture.Tokushima,
    CurrentPrefecture.Kochi,
    CurrentPrefecture.Ehime,
  ];

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const user = await createUser(values.name, values.prefecture);
      if (user) {
        router.push("/");
      }
    } catch (error) {
      console.error("Sign up error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">アカウント情報の登録</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base">表示名</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="名前を入力" 
                    {...field} 
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="prefecture"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base">住んでいるところ</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {prefectures.map((prefecture) => (
                        <Button
                          key={prefecture}
                          type="button"
                          variant="secondary"
                          className={`h-12 rounded-2xl border-2 ${
                            field.value === prefecture
                              ? 'bg-blue-600 text-white border-blue-600'
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => field.onChange(prefecture)}
                        >
                          {prefectureLabels[prefecture]}
                        </Button>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="secondary"
                      className={`w-full h-12 rounded-2xl border-2 ${
                        field.value === CurrentPrefecture.OutsideShikoku
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => field.onChange(CurrentPrefecture.OutsideShikoku)}
                    >
                      {prefectureLabels[CurrentPrefecture.OutsideShikoku]}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-12 text-base"
            disabled={isLoading}
          >
            {isLoading ? "作成中..." : "アカウントを作成"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
