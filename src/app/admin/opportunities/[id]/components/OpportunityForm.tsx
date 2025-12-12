"use client";

import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OpportunityFormValues } from "../opportunityForm";
import { useOpportunityForm } from "../hooks/useOpportunityForm";
import { CategoryField } from "@/app/admin/opportunities/[id]/components/fields/CategoryField";
import { TitleField } from "@/app/admin/opportunities/[id]/components/fields/TitleField";
import { SummaryField } from "@/app/admin/opportunities/[id]/components/fields/SummaryField";
import { DescriptionField } from "@/app/admin/opportunities/[id]/components/fields/DescriptionField";
import { HostUserField } from "@/app/admin/opportunities/[id]/components/fields/HostUserField";
import { PlaceField } from "@/app/admin/opportunities/[id]/components/fields/PlaceField";
import { RequireApprovalField } from "@/app/admin/opportunities/[id]/components/fields/RequireApprovalField";
import { CapacityField } from "@/app/admin/opportunities/[id]/components/fields/CapacityField";
import { PriceField } from "@/app/admin/opportunities/[id]/components/fields/PriceField";
import { PointField } from "@/app/admin/opportunities/[id]/components/fields/PointField";
import { SlotsField } from "@/app/admin/opportunities/[id]/components/fields/SlotsField";
import { ImagesField } from "@/app/admin/opportunities/[id]/components/fields/ImagesField";
import { PublishStatusField } from "@/app/admin/opportunities/[id]/components/fields/PublishStatusField";
import { GqlOpportunityCategory } from "@/types/graphql";

type Props = {
  mode: "create" | "update";
  opportunityId?: string;
  initialValues: OpportunityFormValues;
  onSuccess?: (opportunityId?: string) => void;
};

// TODO: これらを実際のAPIから取得するように変更
const CATEGORIES = [
  { value: GqlOpportunityCategory.Activity, label: "アクティビティ" },
  { value: GqlOpportunityCategory.Quest, label: "クエスト" },
];

const HOSTS: { id: string; name: string }[] = [];
const PLACES: { id: string; label: string }[] = [];

export function OpportunityForm({ mode, opportunityId, initialValues, onSuccess }: Props) {
  const form = useOpportunityForm(initialValues, { mode, opportunityId });

  const handleSubmit = async (values: OpportunityFormValues) => {
    const resultId = await form.submit(values);
    onSuccess?.(resultId);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 max-w-mobile-l mx-auto pb-20"
      >
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
            <CardDescription>カテゴリ、タイトル、概要、詳細などを入力します</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <CategoryField form={form} categories={CATEGORIES} />
            <TitleField form={form} />
            <SummaryField form={form} />
            <DescriptionField form={form} />
          </CardContent>
        </Card>

        {/* 主催・場所 */}
        <Card>
          <CardHeader>
            <CardTitle>主催・場所</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <HostUserField form={form} hosts={HOSTS} />
            <PlaceField form={form} places={PLACES} />
            <RequireApprovalField form={form} />
          </CardContent>
        </Card>

        {/* 募集条件 */}
        <Card>
          <CardHeader>
            <CardTitle>募集条件</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <CapacityField form={form} />
            <PriceField form={form} />
            <PointField form={form} />
          </CardContent>
        </Card>

        {/* 開催枠 */}
        <SlotsField form={form} />

        {/* 画像 */}
        <ImagesField form={form} />

        {/* 公開設定 */}
        <Card>
          <CardHeader>
            <CardTitle>公開設定</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <PublishStatusField form={form} />
          </CardContent>
        </Card>

        {/* 送信 */}
        <Button type="submit" disabled={form.isSubmitting} className="w-full py-4">
          {form.isSubmitting ? "保存中..." : mode === "create" ? "作成" : "更新"}
        </Button>
      </form>
    </Form>
  );
}
