"use client";
import { use, useMemo } from "react";
import { useGetNftInstanceWithDidQuery } from "@/types/graphql";
import { ErrorState, InfoCard } from "@/components/shared";
import { InfoCardProps } from "@/types";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import Image from "next/image";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { useNftDetailData } from "./lib/useNftDetailData";
import { getNftImageUrl } from "@/lib/nfts/image-helper";

export default function NftPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: nftInstanceWithDid, loading } = useGetNftInstanceWithDidQuery({
    variables: { id: id },
  });
  const headerConfig = useMemo(
    () => ({
      title: "証明書の確認",
      showBackButton: true,
      showLogo: false,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const nftInstance = nftInstanceWithDid?.nftInstance;
  const { basic, blockchain } = useNftDetailData(nftInstance);

  if (loading) return <LoadingIndicator />;

  if (!nftInstance) {
    return <ErrorState title="NFTが見つかりません" />;
  }

  const infoCardsValueList: InfoCardProps[] = [
    {
      label: "保有者",
      value: basic.username,
      secondaryValue: basic.didValue || "",
      secondaryLabel: "DID",
      isWarning: !basic.didValue,
      warningText: "did発行準備中",
      showCopy: !!basic.didValue,
      copyData: basic.didValue ?? "",
      truncatePattern: "middle",
    },
    {
      label: "証明書ID",
      value: basic.instanceId,
      showCopy: true,
      copyData: basic.instanceId,
      truncatePattern: "middle",
      truncateHead: 6,
      truncateTail: 4,
    },
    {
      label: "コントラクト\nアドレス",
      value: basic.contractAddress,
      showCopy: true,
      copyData: basic.contractAddress,
      truncatePattern: "middle",
      truncateHead: 6,
      truncateTail: 4,
    },
    ...(blockchain.chainDisplayName ? [{
      label: "チェーン",
      value: blockchain.chainDisplayName,
    }] : []),
    ...(basic.tokenType ? [{
      label: "規格",
      value: basic.tokenType,
    }] : []),
  ];

  return (
    <>
      <div className="flex justify-center mt-10">
        <div>
          <Image
            src={getNftImageUrl(basic.imageUrl, basic.instanceId)}
            alt={basic.instanceName ?? "証明書"}
            width={120}
            height={120}
            className="object-cover border-none shadow-none mx-auto rounded-sm"
          />
          <h1 className="text-title-sm font-bold w-[70%] mx-auto mt-4 text-center">
            {basic.instanceName}
          </h1>
        </div>
      </div>
      <div className="mt-6 p-4">
        <div className="grid grid-cols-1 gap-1 relative">
          {infoCardsValueList.map((card, index) => (
            <InfoCard key={index} {...card} />
          ))}
        </div>
        {blockchain.explorerUrl && (
          <div className="mt-4 flex justify-center">
            <Button variant="text" asChild>
              <a href={blockchain.explorerUrl} target="_blank" rel="noopener noreferrer">
                証明を検証する
              </a>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
