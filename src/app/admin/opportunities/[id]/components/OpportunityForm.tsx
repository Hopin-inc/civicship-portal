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

type Props = {
  initialValues: OpportunityFormValues;
  categories: { value: OpportunityFormValues["category"]; label: string }[];
  hosts: { id: string; name: string }[];
  places: { id: string; label: string }[];
  onSubmit: (v: OpportunityFormValues) => Promise<void>;
};

export function OpportunityForm({ initialValues, categories, hosts, places, onSubmit }: Props) {
  const form = useOpportunityForm(initialValues, onSubmit);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(form.submit)}
        className="space-y-8 max-w-mobile-l mx-auto pb-20"
      >
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
            <CardDescription>カテゴリ、タイトル、概要、詳細などを入力します</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <CategoryField form={form} categories={categories} />
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
            <HostUserField form={form} hosts={hosts} />
            <PlaceField form={form} places={places} />
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
        <Button type="submit" className="w-full py-4">
          実行する
        </Button>
      </form>
    </Form>
  );
}
