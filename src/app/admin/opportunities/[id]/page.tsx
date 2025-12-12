"use client";

import { useParams, useRouter } from "next/navigation";
import { useGetOpportunityQuery } from "@/types/graphql";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRef } from "react";
import dayjs from "dayjs";

export default function OpportunityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const opportunityId = params.id as string;

  const { data, loading, error } = useGetOpportunityQuery({
    variables: {
      id: opportunityId,
      permission: { communityId: COMMUNITY_ID },
    },
  });

  const refetchRef = useRef<(() => void) | null>(null);

  if (loading) return <LoadingIndicator fullScreen />;

  if (error || !data?.opportunity) {
    return <ErrorState title="募集情報を読み込めませんでした" refetchRef={refetchRef} />;
  }

  const opportunity = data.opportunity;

  return (
    <div className="container mx-auto py-8">
      {/* ヘッダー */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{opportunity.title}</h1>
          <p className="text-muted-foreground mt-1">募集詳細</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => router.push(`/admin/opportunities/${opportunityId}/edit`)}
          >
            編集
          </Button>
          <Button variant="outline" onClick={() => router.push("/admin/opportunities")}>
            一覧に戻る
          </Button>
        </div>
      </div>

      {/* 基本情報 */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">カテゴリ</p>
              <p>{opportunity.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">公開ステータス</p>
              <p>{opportunity.publishStatus}</p>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">タイトル</p>
            <p>{opportunity.title}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">概要</p>
            <p>{opportunity.description}</p>
          </div>
          {opportunity.body && (
            <div>
              <p className="text-sm font-medium text-muted-foreground">詳細</p>
              <p className="whitespace-pre-wrap">{opportunity.body}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 主催・場所 */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>主催・場所</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">主催者</p>
            <p>{opportunity.createdByUser?.name || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">場所</p>
            <p>{opportunity.place?.name || "-"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">主催者承認</p>
            <p>{opportunity.requireApproval ? "必要" : "不要"}</p>
          </div>
        </CardContent>
      </Card>

      {/* 募集条件 */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>募集条件</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">定員</p>
              <p>{opportunity.slots[0]?.capacity || "-"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">料金</p>
              <p>{opportunity.feeRequired || 0}円</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">ポイント</p>
              <p>{opportunity.pointsToEarn || 0}pt</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 開催枠 */}
      {opportunity.slots && opportunity.slots.length > 0 && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>開催枠</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {opportunity.slots.map((slot: any, index: number) => (
                <div key={slot.id} className="border rounded-lg p-3">
                  <p className="font-medium">開催枠 {index + 1}</p>
                  <p className="text-sm text-muted-foreground">
                    {dayjs.unix(slot.startsAt).format("YYYY-MM-DD HH:mm")} 〜{" "}
                    {dayjs.unix(slot.endsAt).format("HH:mm")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    定員: {slot.capacity}名 / 残り: {slot.remainingCapacity || slot.capacity}名
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* 画像 */}
      {opportunity.images && opportunity.images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>画像</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {opportunity.images.map((img: string, index: number) => (
                <div key={index} className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">画像 {index + 1}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
