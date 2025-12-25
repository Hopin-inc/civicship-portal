"use client";

import { NftItem, NftItemData } from "./NftItem";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";

interface NftListProps {
  nftInstances: NftItemData[];
  loading?: boolean;
  error?: Error | null;
}

export function NftList({ nftInstances, loading, error }: NftListProps) {
  // 初期ロード中
  if (loading) {
    return <LoadingIndicator fullScreen={false} />;
  }

  // エラー状態
  if (error) {
    return <ErrorState title="NFTの読み込みに失敗しました" />;
  }

  // データが空
  if (nftInstances.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">NFTがありません</p>
      </div>
    );
  }

  // データ表示
  return (
    <div className="flex flex-col">
      {nftInstances.map((nftInstance, idx) => (
        <div key={nftInstance.id}>
          {idx !== 0 && <hr className="border-muted" />}
          <NftItem nftInstance={nftInstance} />
        </div>
      ))}
    </div>
  );
}
