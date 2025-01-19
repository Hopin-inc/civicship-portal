"use client";

import { useQuery } from "@apollo/client";
import { GET_OPPORTUNITY } from "@/graphql/queries/opportunity";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import React from "react";
import { useParticipationSetStatusActions } from "@/app/opportunities/participations/ParticipationSetStatusButton";
import { renderButtons } from "@/app/opportunities/participations/renderSetStatusButtons";
import ParticipationInviteModal from "@/app/opportunities/participations/ParticipationInviteModal";

const OpportunityDetail: React.FC = () => {
  const { id } = useParams(); // URL パラメータから id を取得
  const normalizedId = Array.isArray(id) ? id[0] : id;

  const { data, loading, error } = useQuery(GET_OPPORTUNITY, {
    variables: { id: normalizedId },
    skip: !normalizedId, // id が存在しない場合はクエリをスキップ
    fetchPolicy: "no-cache",
  });

  const actions = useParticipationSetStatusActions(); // ミューテーション関数を取得

  if (!normalizedId) return <p>募集IDが指定されていません。</p>;
  if (loading) return <p>データを読み込んでいます...</p>;
  if (error) return <p>エラーが発生しました。</p>;

  const opportunity = data?.opportunity;

  return (
    <main className="min-h-screen p-24">
      <Link href="/opportunities" className="inline-flex mb-4">
        <ChevronLeft />
        募集一覧に戻る
      </Link>
      <h1 className="text-3xl font-bold mb-8">{opportunity?.title || "募集詳細"}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>タイトル:</strong> {opportunity?.title || "未設定"}</p>
            <p><strong>説明:</strong> {opportunity?.description || "未設定"}</p>
            <p><strong>カテゴリ:</strong> {opportunity?.category || "未設定"}</p>
            <p><strong>開始日時:</strong> {opportunity?.startsAt ? new Date(opportunity.startsAt).toLocaleString() : "未設定"}</p>
            <p><strong>終了日時:</strong> {opportunity?.endsAt ? new Date(opportunity.endsAt).toLocaleString() : "未設定"}</p>
          </CardContent>
        </Card>

        {/* 参加情報 */}
        <Card>
          <CardHeader>
            <CardTitle>参加情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {opportunity?.participations?.length ? (
              opportunity.participations.map((participation) => (
                <div key={participation.id} className="space-y-2">
                  <p>
                    <strong>参加者:</strong> {participation.user?.name || "未設定"}
                  </p>
                  <p>
                    <strong>ステータス:</strong> {participation.status || "未設定"}
                  </p>
                  {renderButtons(participation, actions)}
                </div>
              ))
            ) : (
              <p>参加者がいません。</p>
            )}
          </CardContent>
        </Card>

        {/* ユーザー招待 */}
        <Card>
          <CardHeader>
            <CardTitle>ユーザー招待</CardTitle>
          </CardHeader>
          <CardContent>
            <ParticipationInviteModal opportunityId={normalizedId} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default OpportunityDetail;
