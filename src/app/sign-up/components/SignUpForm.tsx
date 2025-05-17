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
import { useRouter } from "next/navigation";
import { GqlCurrentPrefecture } from "@/types/graphql";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const FormSchema = z.object({
  name: z.string({ required_error: "名前を入力してください。" }),
  prefecture: z.nativeEnum(GqlCurrentPrefecture, {
    required_error: "居住地を選択してください。",
  }),
});

type FormValues = z.infer<typeof FormSchema>;

export function SignUpForm() {
  const router = useRouter();
  const { createUser, isPhoneVerified, phoneAuth } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      prefecture: undefined,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      if (!isPhoneVerified) {
        toast.error("電話番号認証が完了していません");
        router.push("/phone-verification");
        return;
      }

      const phoneUid = phoneAuth.phoneUid;

      const user = await createUser(values.name, values.prefecture, phoneUid);
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
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">アカウント情報の登録</h1>
      </div>
      <Form { ...form }>
        <form onSubmit={ form.handleSubmit(onSubmit) } className="space-y-8">
          <FormField
            control={ form.control }
            name="name"
            render={ ({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base">表示名</FormLabel>
                <FormControl>
                  <Input
                    placeholder="名前を入力"
                    { ...field }
                    className="h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            ) }
          />

          <FormField
            control={ form.control }
            name="prefecture"
            render={ ({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base">住んでいるところ</FormLabel>
                <FormControl>
                  <ToggleGroup onValueChange={ (val) => field.onChange(val as GqlCurrentPrefecture) } type="single"
                               variant="outline" className="gap-2">
                    <ToggleGroupItem value={ GqlCurrentPrefecture.Kagawa }
                                     className="flex-1">香川県</ToggleGroupItem>
                    <ToggleGroupItem value={ GqlCurrentPrefecture.Tokushima }
                                     className="flex-1">徳島県</ToggleGroupItem>
                    <ToggleGroupItem value={ GqlCurrentPrefecture.Ehime }
                                     className="flex-1">愛媛県</ToggleGroupItem>
                    <ToggleGroupItem value={ GqlCurrentPrefecture.Kochi }
                                     className="flex-1">高知県</ToggleGroupItem>
                    <ToggleGroupItem value={ GqlCurrentPrefecture.OutsideShikoku }
                                     className="basis-full">四国以外</ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            ) }
          />

          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={ isLoading }
          >
            { isLoading ? "作成中..." : "アカウントを作成" }
          </Button>
        </form>
      </Form>
    </div>
  );
}
