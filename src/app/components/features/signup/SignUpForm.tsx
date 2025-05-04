'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { CurrentPrefecture } from '@/gql/graphql';
import { useSignUp, SignUpFormValues } from '@/hooks/useSignUp';
import PrefectureSelector from './PrefectureSelector';

const FormSchema = z.object({
  name: z.string({ required_error: '名前を入力してください。' }),
  prefecture: z.nativeEnum(CurrentPrefecture, {
    required_error: '居住地を選択してください。'
  }),
});

/**
 * Sign-up form component with name and prefecture selection
 */
export function SignUpForm() {
  const { isLoading, handleSignUp } = useSignUp();
  
  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      prefecture: undefined,
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    await handleSignUp(values);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
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
                  <PrefectureSelector 
                    value={field.value} 
                    onChange={field.onChange}
                    error={form.formState.errors.prefecture?.message}
                  />
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

export default SignUpForm;
