"use client";

import { useMutation, useQuery } from "@apollo/client";
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
import { Button } from "@/app/components/ui/button";
import { useContext } from "react";
import { FirebaseAuthContext } from "@/contexts/FirebaseAuthContext";
import { USE_UTILITY } from "@/graphql/mutations/utility";

const CommunityDetail: React.FC = () => {
  const { id } = useParams(); // URL パラメータから id を取得
  const normalizedId = Array.isArray(id) ? id[0] : id;

  const { currentUser } = useContext(FirebaseAuthContext); // FirebaseAuthContextから現在のユーザー情報を取得
  const { data, loading, error } = useQuery(GET_COMMUNITY, {
    variables: { id: normalizedId },
    skip: !normalizedId,
    fetchPolicy: "no-cache",
  });

  const [utilityUse] = useMutation(USE_UTILITY);

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
              community.utilities.map((utility) => {
                // 現在のユーザーのウォレットとメンバーシップを取得
                const userMembership = community.memberships?.find(
                  (m) => m.user.id === currentUser?.user?.id
                );

                const userWallet = community.wallets?.find(
                  (w) => w.user?.id === currentUser?.user?.id
                );

                return (
                  <div key={utility.id} className="flex items-center justify-between">
                    <div>
                      <p>
                        <strong>{utility.name}</strong> - {utility.description || "説明がありません"}
                      </p>
                      <p>
                        <strong>必要ポイント:</strong> {utility.pointsRequired ?? "未設定"}
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        if (!userWallet?.id) {
                          alert("ウォレットが見つかりません。");
                          return;
                        }

                        utilityUse({
                          variables: {
                            id: utility.id,
                            input: { userWalletId: userWallet.id }, // 確実に string を渡す
                          },
                        })
                          .then(() => {
                            alert(`ユーティリティ「${utility.name}」を利用しました！`);
                          })
                          .catch((e) => {
                            alert(`エラーが発生しました: ${e.message}`);
                          });
                      }}
                      disabled={!userMembership || !userWallet}
                    >
                      利用する
                    </Button>
                  </div>
                );
              })
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
