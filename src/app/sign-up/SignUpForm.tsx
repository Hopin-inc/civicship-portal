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
import { CREATE_USER } from "@/graphql/mutations/identity";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const FormSchema = z
  .object({
    name: z.string({ required_error: "必ず選択してください。" }),
    slug: z.string({ required_error: "必ず選択してください。" }),
  })

const SignUpForm: React.FC = () => {
  const router = useRouter();
  const { currentUser } = useFirebaseAuth();
  const [createUser] = useMutation(CREATE_USER, {
    fetchPolicy: "no-cache",
  });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      slug: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    await createUser({
      variables: {
        input: data,
      },
    });
    toast.success("新規登録完了!");
    router.push("/");
  };

  const currentUserInfoText = `${currentUser?.displayName} [${currentUser?.providerIds.join(", ")}]`;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-[480px]">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-9">
            <FormLabel>ログインユーザー</FormLabel>
            <Input type="text" disabled value={currentUserInfoText} className="mt-2" />
          </div>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="col-span-6">
                <FormLabel required>名前</FormLabel>
                <FormControl>
                  <Input placeholder="例: 太郎" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-12 gap-4">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="col-span-6">
                <FormLabel required>ユーザーID</FormLabel>
                <FormControl>
                  <Input placeholder="taro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit">新規登録</Button>
        </div>
      </form>
    </Form>
  );
};

export default SignUpForm;
