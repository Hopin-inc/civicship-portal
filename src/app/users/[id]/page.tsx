"use client";

import { useQuery } from "@apollo/client";
import { GET_USER } from "@/graphql/queries/user";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

const UserDetail: React.FC = () => {
  const { id } = useParams(); // URL パラメータから id を取得
  const normalizedId = Array.isArray(id) ? id[0] : id; // 配列の場合は最初の要素を使用

  const { data, loading, error } = useQuery(GET_USER, {
    variables: { id: normalizedId }, // 正規化した id を使用
    skip: !normalizedId, // id が存在しない場合はクエリをスキップ
    fetchPolicy: "no-cache",
  });

  if (!normalizedId) return <p>ユーザーIDが指定されていません。</p>;
  if (loading) return <p>データを読み込んでいます...</p>;
  if (error) return <p>エラーが発生しました。</p>;

  const user = data?.user;

  return (
    <main className="min-h-screen p-24">
      <Link href="/users" className="inline-flex mb-4">
        <ChevronLeft />
        ユーザー一覧に戻る
      </Link>
      <h1 className="text-3xl font-bold mb-8">{user?.name || "ユーザー詳細"}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>プロフィール</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>名前:</strong> {user?.name || "未設定"}</p>
            <p><strong>スラッグ:</strong> {user?.slug || "未設定"}</p>
            <p><strong>説明:</strong> {user?.bio || "未設定"}</p>
            <p><strong>ウェブサイト:</strong> {user?.urlWebsite || "未設定"}</p>
          </CardContent>
        </Card>

        {/* メンバーシップ */}
        <Card>
          <CardHeader>
            <CardTitle>メンバーシップ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {user?.memberships?.length ? (
              user.memberships.map((membership) => (
                <p key={membership.community.id}>
                  <strong>{membership.community.name}</strong> - {membership.role}
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
            {user?.wallets?.length ? (
              user.wallets.map((wallet) => (
                <p key={wallet.id}>
                  <strong>{wallet.community.name}</strong> - 現在のポイント: {wallet.currentPointView?.currentPoint || 0}
                </p>
              ))
            ) : (
              <p>ウォレットがありません。</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default UserDetail;
