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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CurrentPrefecture, IdentityPlatform } from "@/gql/graphql";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const prefectureOptions = [
  { value: 'KAGAWA', label: '香川県' },
  { value: 'TOKUSHIMA', label: '徳島県' },
  { value: 'KOCHI', label: '高知県' },
  { value: 'EHIME', label: '愛媛県' },
] as const;

const FormSchema = z.object({
  name: z.string({ required_error: "名前を入力してください。" }),
  prefecture: z.enum(['KAGAWA', 'TOKUSHIMA', 'KOCHI', 'EHIME', 'OTHER'], {
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

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      const user = await createUser(values.name, values.prefecture as CurrentPrefecture);
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
                      {prefectureOptions.map(({ value, label }) => (
                        <Button
                          key={value}
                          type="button"
                          variant="outline"
                          className={`h-12 rounded-2xl border-2 ${
                            field.value === value 
                              ? 'border-primary bg-primary/10 text-primary font-medium' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => field.onChange(value)}
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className={`w-full h-12 rounded-2xl border-2 ${
                        field.value === 'OTHER'
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => field.onChange('OTHER')}
                    >
                      四国以外
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
