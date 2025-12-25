"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useGetNftInstancesQuery } from "@/types/graphql";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { NftCard } from "@/components/domains/nfts/components/NftCard";

export default function AdminNftsPage() {
  const headerConfig = useMemo(
    () => ({
      title: "NFT一覧",
      showLogo: false,
      showBackButton: true,
      backTo: "/admin",
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { data, loading, error } = useGetNftInstancesQuery({
    variables: {
      first: 100,
      filter: {
        communityId: COMMUNITY_ID,
      },
    },
    fetchPolicy: "network-only",
  });

  // 初期ロード中
  if (loading) {
    return (
      <div className="p-4 flex justify-center items-center h-screen">
        <LoadingIndicator />
      </div>
    );
  }

  // エラー状態
  if (error) {
    return (
      <div className="p-4">
        <ErrorState title="NFTの読み込みに失敗しました" />
      </div>
    );
  }

  const nftInstances = data?.nftInstances?.edges
    .map((edge) => edge.node)
    .filter((node) => node != null) || [];

  // データが空
  if (nftInstances.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">NFTがありません</p>
      </div>
    );
  }

  // データ表示（グリッドレイアウト）
  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {nftInstances.map((nftInstance) => (
          <NftCard
            key={nftInstance.id}
            nftInstance={{
              id: nftInstance.id,
              name: nftInstance.name,
              imageUrl: nftInstance.imageUrl,
            }}
          />
        ))}
      </div>
    </div>
  );
}
