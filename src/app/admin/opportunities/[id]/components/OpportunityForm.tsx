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
import {
  GqlOpportunityCategory,
  useGetMembershipListQuery,
  useGetPlacesQuery,
  GqlMembershipStatus,
} from "@/types/graphql";
import { useMemo } from "react";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

type Props = {
  mode: "create" | "update";
  opportunityId?: string;
  initialValues: OpportunityFormValues;
  onSuccess?: (opportunityId?: string) => void;
};

export function OpportunityForm({ mode, opportunityId, initialValues, onSuccess }: Props) {
  // メンバー一覧取得
  const { data: membersData, loading: membersLoading } = useGetMembershipListQuery({
    variables: {
      filter: {
        communityId: COMMUNITY_ID,
        status: GqlMembershipStatus.Approved,
      },
      first: 100,
    },
    fetchPolicy: "cache-first",
  });

  // 場所一覧取得
  const { data: placesData, loading: placesLoading } = useGetPlacesQuery({
    variables: {
      filter: {
        communityId: COMMUNITY_ID,
      },
      first: 100,
    },
    fetchPolicy: "cache-first",
  });

  // データ変換
  const hosts = useMemo(() => {
    return (membersData?.memberships?.edges || [])
      .map((edge) => edge?.node?.user)
      .filter((user): user is NonNullable<typeof user> => user != null)
      .map((user) => ({
        id: user.id,
        name: user.name || "名前なし",
      }));
  }, [membersData]);

  const places = useMemo(() => {
    return (placesData?.places?.edges || [])
      .map((edge) => edge?.node)
      .filter((place): place is NonNullable<typeof place> => place != null)
      .map((place) => ({
        id: place.id,
        label: place.name,
      }));
  }, [placesData]);

  const categories = [
    { value: GqlOpportunityCategory.Activity, label: "アクティビティ" },
    { value: GqlOpportunityCategory.Quest, label: "クエスト" },
  ];

  const form = useOpportunityForm(initialValues, { mode, opportunityId });

  const handleSubmit = async (values: OpportunityFormValues) => {
    const resultId = await form.submit(values);
    onSuccess?.(resultId);
  };

  // ローディング中
  if (membersLoading || placesLoading) {
    return (
      <div className="container mx-auto py-8">
        <LoadingIndicator />
      </div>
    );
  }

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
        <Button type="submit" disabled={form.isSubmitting} className="w-full py-4">
          {form.isSubmitting ? "保存中..." : mode === "create" ? "作成" : "更新"}
        </Button>
      </form>
    </Form>
  );
}
