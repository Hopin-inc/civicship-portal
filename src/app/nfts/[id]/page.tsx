"use client";
import { use, useMemo } from "react";
import { GqlDidIssuanceStatus, useGetNftInstanceWithDidQuery } from "@/types/graphql";
import { ErrorState, InfoCard } from "@/components/shared";
import { InfoCardProps } from "@/types";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import Image from "next/image";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { Button } from "@/components/ui/button";
import {
  detectChain,
  detectChainFromAddress,
  getExplorerUrl,
  getChainDisplayName,
  extractCardanoAssetNameHex,
} from "@/lib/blockchain";

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

  if (loading) return <LoadingIndicator />;

  if (!nftInstanceWithDid?.nftInstance) {
    return <ErrorState title="NFTが見つかりません" />;
  }

  const nftInstance = nftInstanceWithDid.nftInstance;
  const { instanceId, imageUrl, name: instanceName, json: instanceJson } = nftInstance;

  const { address: contractAddress, type: tokenType, json: tokenJson } = nftInstance.nftToken ?? {};

  const { name: username } = nftInstance.nftWallet?.user ?? {};

  const didValue = nftInstance.nftWallet?.user?.didIssuanceRequests?.find(
    (request) => request.status === GqlDidIssuanceStatus.Completed,
  )?.didValue;

  const chain = detectChain(tokenType) || detectChainFromAddress(contractAddress);
  const chainDisplayName = chain ? getChainDisplayName(chain) : undefined;

  const assetNameHex = chain === 'cardano' ? extractCardanoAssetNameHex(instanceJson) : undefined;

  const explorerUrl = chain && contractAddress ? getExplorerUrl({
    chain,
    contractOrPolicyAddress: contractAddress,
    assetNameHex,
  }) : undefined;

  const infoCardsValueList: InfoCardProps[] = [
    {
      label: "保有者",
      value: username,
      secondaryValue: didValue || "",
      secondaryLabel: "DID",
      isWarning: !didValue,
      warningText: "did発行準備中",
      showCopy: !!didValue,
      copyData: didValue ?? "",
      truncatePattern: "middle",
    },
    {
      label: "証明書ID",
      value: instanceId,
      showCopy: true,
      copyData: instanceId,
      truncatePattern: "middle",
    },
    {
      label: "コントラクト\nアドレス",
      value: contractAddress,
      showCopy: true,
      copyData: contractAddress,
      truncatePattern: "middle",
    },
    ...(chainDisplayName ? [{
      label: "チェーン",
      value: chainDisplayName,
    }] : []),
    ...(tokenType ? [{
      label: "規格",
      value: tokenType,
    }] : []),
  ];

  return (
    <>
      <div className="flex justify-center mt-10">
        <div>
          <Image
            src={imageUrl ?? ""}
            alt={instanceName ?? "証明書"}
            width={120}
            height={120}
            className="object-cover border-none shadow-none mx-auto rounded-sm"
          />
          <h1 className="text-title-sm font-bold w-[70%] mx-auto mt-4 text-center">
            {instanceName}
          </h1>
        </div>
      </div>
      <div className="mt-6 p-4">
        <div className="grid grid-cols-1 gap-1 relative">
          {infoCardsValueList.map((card, index) => (
            <InfoCard key={index} {...card} />
          ))}
        </div>
        {explorerUrl && (
          <div className="mt-4">
            <Button variant="text" asChild>
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                ブロックチェーンで確認
              </a>
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
