"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslations } from "next-intl";
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
import { GqlCurrentPrefecture } from "@/types/graphql";
import { useAuthCompat as useAuth } from "@/hooks/auth/useAuthCompat";
import { useState } from "react";
import { toast } from "react-toastify";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { logger } from "@/lib/logging";
import { currentCommunityConfig } from "@/lib/communities/metadata";
import { useAuthStore } from "@/lib/auth/core/auth-store";

const createFormSchema = (t: (key: string) => string) => z.object({
  name: z
    .string({ required_error: t("nameRequired") })
    .trim()
    .nonempty(t("nameRequired")),
  prefecture: z.nativeEnum(GqlCurrentPrefecture, {
    required_error: t("prefectureRequired"),
  }),
});

export function SignUpForm() {
  const t = useTranslations();
  const { createUser, isAuthenticated, isPhoneVerified, phoneAuth, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const firebaseUser = useAuthStore((s) => s.state.firebaseUser);

  const FormSchema = createFormSchema((key: string) => t(`auth.signup.${key}`));
  type FormValues = z.infer<typeof FormSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: undefined,
      prefecture: GqlCurrentPrefecture.Unknown,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    try {
      if (!firebaseUser) {
        toast.error(t("auth.signup.lineAuthRequired"));
        return null;
      }

      const phoneUid = phoneAuth.phoneUid;
      if (!phoneUid || !isPhoneVerified) {
        toast.error(t("auth.signup.phoneAuthRequired"));
        return null;
      }

      await createUser(values.name, values.prefecture, phoneUid);
      toast.success(t("auth.signup.successMessage"));
    } catch (error) {
      logger.warn("Sign up error", {
        error: error instanceof Error ? error.message : String(error),
        component: "SignUpForm",
      });
      toast.error(t("auth.signup.errorMessage"));
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <LoadingIndicator />;
  }

  if (!isAuthenticated || !isPhoneVerified) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">{t("auth.signup.title")}</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel className="text-base">{t("auth.signup.nameLabel")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("auth.signup.namePlaceholder")} {...field} className="h-12" />
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground">
                  {t("auth.signup.nameDescription")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {currentCommunityConfig.enableFeatures.includes("prefectures") && (
            <FormField
              control={form.control}
              name="prefecture"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-base">{t("auth.signup.prefectureLabel")}</FormLabel>
                  <FormControl>
                    <ToggleGroup
                      onValueChange={(val) => field.onChange(val as GqlCurrentPrefecture)}
                      type="single"
                      variant="outline"
                      className="gap-2"
                    >
                      <ToggleGroupItem value={GqlCurrentPrefecture.Kagawa} className="flex-1">
                        {t("auth.signup.prefectureKagawa")}
                      </ToggleGroupItem>
                      <ToggleGroupItem value={GqlCurrentPrefecture.Tokushima} className="flex-1">
                        {t("auth.signup.prefectureTokushima")}
                      </ToggleGroupItem>
                      <ToggleGroupItem value={GqlCurrentPrefecture.Ehime} className="flex-1">
                        {t("auth.signup.prefectureEhime")}
                      </ToggleGroupItem>
                      <ToggleGroupItem value={GqlCurrentPrefecture.Kochi} className="flex-1">
                        {t("auth.signup.prefectureKochi")}
                      </ToggleGroupItem>
                      <ToggleGroupItem
                        value={GqlCurrentPrefecture.OutsideShikoku}
                        className="basis-full"
                      >
                        {t("auth.signup.prefectureOutsideShikoku")}
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={isLoading || !!form.formState.errors.name}
          >
            {isLoading ? t("auth.signup.submitting") : t("auth.signup.submitButton")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
