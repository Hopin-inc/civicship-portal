"use client";
import { use, useMemo } from "react";
import { GqlDidIssuanceStatus, useGetNftInstanceWithDidQuery } from "@/types/graphql";
import { ErrorState, InfoCard } from "@/components/shared";
import { InfoCardProps } from "@/types";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import Image from "next/image";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function NftPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const {
    data: nftInstanceWithDid,
    loading,
    error,
  } = useGetNftInstanceWithDidQuery({
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

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error || !nftInstanceWithDid?.nftInstance) {
    return <ErrorState title="NFTが見つかりません" />;
  }

  const nftInstance = nftInstanceWithDid.nftInstance;
  const { instanceId, imageUrl, name: instanceName } = nftInstance;

  const { address: contractAddress, type: tokenType } = nftInstance.nftToken ?? {};

  const { name: username } = nftInstance.nftWallet?.user ?? {};

  const didValue = nftInstance.nftWallet?.user?.didIssuanceRequests?.find(
    (request) => request.status === GqlDidIssuanceStatus.Completed,
  )?.didValue;

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
    {
      label: "チェーン",
      value: "Ethereum",
    },
    {
      label: "規格",
      value: tokenType,
    },
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
      </div>
    </>
  );
}
