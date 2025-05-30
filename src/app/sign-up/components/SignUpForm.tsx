"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { GqlCurrentPrefecture } from "@/types/graphql";
import { useAuth } from "@/contexts/AuthProvider";
import { useState } from "react";
import { toast } from "sonner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { AuthRedirectService } from "@/lib/auth/auth-redirect-service";

const FormSchema = z.object({
  name: z.string({ required_error: "名前を入力してください。" }),
  prefecture: z.nativeEnum(GqlCurrentPrefecture, {
    required_error: "居住地を選択してください。",
  }),
});

type FormValues = z.infer<typeof FormSchema>;

export function SignUpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextParam = searchParams.get("next");
  const { createUser, isAuthenticated, isPhoneVerified, phoneAuth, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const authRedirectService = AuthRedirectService.getInstance();
  const redirectPath = authRedirectService.getRedirectPath("/sign-up", nextParam);

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
        router.replace(redirectPath ?? "/users/me");
        return;
      }

      const phoneUid = phoneAuth.phoneUid;

      const user = await createUser(values.name, values.prefecture, phoneUid);
      if (user) {
        setIsRedirecting(true);
        router.push(redirectPath ?? "/users/me");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      toast.error("アカウント作成に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (isRedirecting) {
    return <LoadingIndicator />;
  }

  if (!isAuthenticated || !isPhoneVerified) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
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
                {/* #NOTE: 運営メンバーが本名でないと、誰かが誰かを区別できなくなる可能性があるため本名としているが、NEO88における特殊対応 */}
                <FormLabel className="text-base">本名</FormLabel>
                <FormControl>
                  <Input placeholder="山田太郎" {...field} className="h-12" />
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground">
                  ※ どなたか分からなくなるため、必ず本名をご入力ください
                </FormDescription>
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
                  <ToggleGroup
                    onValueChange={(val) => field.onChange(val as GqlCurrentPrefecture)}
                    type="single"
                    variant="outline"
                    className="gap-2"
                  >
                    <ToggleGroupItem value={GqlCurrentPrefecture.Kagawa} className="flex-1">
                      香川県
                    </ToggleGroupItem>
                    <ToggleGroupItem value={GqlCurrentPrefecture.Tokushima} className="flex-1">
                      徳島県
                    </ToggleGroupItem>
                    <ToggleGroupItem value={GqlCurrentPrefecture.Ehime} className="flex-1">
                      愛媛県
                    </ToggleGroupItem>
                    <ToggleGroupItem value={GqlCurrentPrefecture.Kochi} className="flex-1">
                      高知県
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value={GqlCurrentPrefecture.OutsideShikoku}
                      className="basis-full"
                    >
                      四国以外
                    </ToggleGroupItem>
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full h-12 text-base" disabled={isLoading}>
            {isLoading ? "作成中..." : "アカウントを作成"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
