"use client";

import { use, useMemo } from "react";
import Image from "next/image";
import { useGetProductQuery } from "@/types/graphql";
import { ErrorState, InfoCard } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { InfoCardProps } from "@/types";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useAuth } from "@/contexts/AuthProvider";
import { useProductBuy } from "@/app/products/[id]/hooks/useProductBuy";
import { NoticeCard } from "@/components/shared/NoticeCard";

const formatDate = (value?: string | Date | null): string => {
  if (!value) return "-";
  const date = typeof value === "string" ? new Date(value) : value;
  return isNaN(date.getTime()) ? "-" : date.toLocaleDateString("ja-JP");
};

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { user, authenticationState } = useAuth();
  const isLogin = authenticationState === "user_registered" && !!user;

  const { data, loading, error } = useGetProductQuery({ variables: { id } });
  const { handleBuy, buying } = useProductBuy(id);

  const headerConfig = useMemo(
    () => ({
      title: "購入確認",
      showLogo: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  if (loading) return <LoadingIndicator />;
  if (error || !data?.product) return <ErrorState title="商品情報を取得できませんでした" />;

  const { name, description, price, imageUrl, remainingSupply, startsAt, endsAt } = data.product;

  const infoCards: InfoCardProps[] = [
    {
      label: "販売期間",
      value: startsAt || endsAt ? `${formatDate(startsAt)} 〜 ${formatDate(endsAt)}` : "無期限",
    },
    {
      label: "価格",
      value: `${price.toLocaleString()}円(税込)`,
    },
  ];

  return (
    <main className="min-h-screen pb-24">
      {/* 🧭 商品ヒーローエリア */}
      <div className="flex justify-center mt-10">
        <div>
          <Image
            src={imageUrl ?? ""}
            alt={name}
            width={160}
            height={160}
            className="object-cover border-none shadow-none mx-auto rounded-sm"
          />
          <h1 className="text-title-sm font-bold text-center mt-4">{name}</h1>
          {description && (
            <p className="text-sm text-muted-foreground mt-2 text-center">{description}</p>
          )}
        </div>
      </div>

      {/* 💬 注記（推定番号の扱い・購入順） */}
      <div className="mt-6 p-4">
        {!isLogin ? (
          <NoticeCard
            title="購入前にご確認ください"
            description="LINEアプリが開きます。購入にはLINEアカウントおよび電話番号の認証が必要です。"
          />
        ) : (
          <NoticeCard
            title="決済について"
            description="ブラウザで決済ページが開きます。支払い完了後は自動的にLINEに戻ります。"
          />
        )}
      </div>

      {/* ℹ️ 商品情報カード群 */}
      <div className="mt-1 px-4">
        <div className="grid grid-cols-1 gap-2 relative">
          {infoCards.map((card, i) => (
            <InfoCard key={i} {...card} />
          ))}
        </div>
      </div>

      {/* 💸 購入CTA */}
      <div className="flex flex-col items-center mt-10">
        <Button
          size="lg"
          className="mx-auto px-20"
          onClick={handleBuy}
          disabled={remainingSupply === 0 || buying}
          variant={isLogin ? "primary" : "secondary"}
        >
          <p className="whitespace-pre-line text-center">
            {!isLogin ? (
              <>
                <span className="text-label-md font-bold">LINEログインして</span>
                <br />
                <span className="text-label-lg pt-1 font-bold">購入する</span>
              </>
            ) : (
              "購入に進む"
            )}
          </p>
        </Button>

        {/* 在庫メッセージ */}
        {remainingSupply <= 5 && (
          <p
            className={`text-xs mt-3 text-center ${
              remainingSupply === 0 ? "text-muted-foreground" : "text-warning"
            }`}
          >
            {remainingSupply === 0
              ? "在庫が上限に達しました。"
              : `残りわずかです（残り${remainingSupply}枚）`}
          </p>
        )}
      </div>
    </main>
  );
}
