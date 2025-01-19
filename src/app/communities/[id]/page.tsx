"use client";

import { useQuery } from "@apollo/client";
import { GET_COMMUNITY } from "@/graphql/queries/community";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

const CommunityDetail: React.FC = () => {
  const { id } = useParams(); // URL パラメータから id を取得
  const normalizedId = Array.isArray(id) ? id[0] : id; // 配列の場合は最初の要素を使用

  const { data, loading, error } = useQuery(GET_COMMUNITY, {
    variables: { id: normalizedId },
    skip: !normalizedId, // id が存在しない場合はクエリをスキップ
    fetchPolicy: "no-cache",
  });

  if (!normalizedId) return <p>コミュニティIDが指定されていません。</p>;
  if (loading) return <p>データを読み込んでいます...</p>;
  if (error) return <p>エラーが発生しました。</p>;

  const community = data?.community;

  return (
    <main className="min-h-screen p-24">
      <Link href="/communities" className="inline-flex mb-4">
        <ChevronLeft />
        コミュニティ一覧に戻る
      </Link>
      <h1 className="text-3xl font-bold mb-8">{community?.name || "コミュニティ詳細"}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 基本情報 */}
        <Card>
          <CardHeader>
            <CardTitle>基本情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><strong>名前:</strong> {community?.name || "未設定"}</p>
            <p><strong>ポイント名:</strong> {community?.pointName || "未設定"}</p>
            <p><strong>説明:</strong> {community?.bio || "未設定"}</p>
            <p><strong>ウェブサイト:</strong> {community?.website || "未設定"}</p>
            <p><strong>設立日:</strong> {community?.establishedAt ? new Date(community.establishedAt).toLocaleDateString() : "未設定"}</p>
          </CardContent>
        </Card>

        {/* メンバーシップ */}
        <Card>
          <CardHeader>
            <CardTitle>メンバーシップ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {community?.memberships?.length ? (
              community.memberships.map((membership) => (
                <p key={membership.user.id}>
                  <strong>{membership.user.name}</strong> - {membership.role}
                </p>
              ))
            ) : (
              <p>メンバーシップがありません。</p>
            )}
          </CardContent>
        </Card>

        {/* ウォレット */}
        <Card>
          <CardHeader>
            <CardTitle>ウォレット</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {community?.wallets?.length ? (
              community.wallets.map((wallet) => (
                <p key={wallet.id}>
                  <strong>現在のポイント:</strong> {wallet.currentPointView?.currentPoint || 0}
                </p>
              ))
            ) : (
              <p>ウォレットがありません。</p>
            )}
          </CardContent>
        </Card>

        {/* 募集 */}
        <Card>
          <CardHeader>
            <CardTitle>募集</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {community?.opportunities?.length ? (
              community.opportunities.map((opportunity) => (
                <p key={opportunity.id}>
                  <strong>{opportunity.title}</strong> - {opportunity.description}
                </p>
              ))
            ) : (
              <p>募集がありません。</p>
            )}
          </CardContent>
        </Card>

        {/* ユーティリティ */}
        <Card>
          <CardHeader>
            <CardTitle>ユーティリティ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {community?.utilities?.length ? (
              community.utilities.map((utility) => (
                <p key={utility.id}>
                  <strong>{utility.name}</strong> - {utility.description || "説明がありません"}
                </p>
              ))
            ) : (
              <p>ユーティリティがありません。</p>
            )}
          </CardContent>
        </Card>

      </div>
    </main>
  );
};

export default CommunityDetail;
