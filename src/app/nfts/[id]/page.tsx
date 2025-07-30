"use client";
import { use, useMemo } from "react";
import { GqlDidIssuanceStatus, useGetNftInstanceWithDidQuery } from "@/types/graphql";
import { NftDetailList } from "./components/NftDetailList";
import ErrorState from "@/components/shared/ErrorState";
import useHeaderConfig from "@/hooks/useHeaderConfig";

export default function NftPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: nftInstanceWithDid } = useGetNftInstanceWithDidQuery({
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
  if (!nftInstanceWithDid?.nftInstance) {
    return <ErrorState title="NFTが見つかりません" />
  }
  const didValue = nftInstanceWithDid?.nftInstance?.nftWallet?.user?.didIssuanceRequests?.find(request => request.status === GqlDidIssuanceStatus.Completed)?.didValue;
  const instanceId = nftInstanceWithDid?.nftInstance?.instanceId;
  const contractAddress = nftInstanceWithDid?.nftInstance?.nftToken?.address;
  const tokenType = nftInstanceWithDid?.nftInstance?.nftToken?.type;
  const imageUrl = nftInstanceWithDid?.nftInstance?.imageUrl;
  const instanceName = nftInstanceWithDid?.nftInstance?.name;
  const username = nftInstanceWithDid?.nftInstance?.nftWallet?.user?.name;
  return (
    <NftDetailList
      didValue={didValue ?? ""}
      instanceId={instanceId ?? ""}
      contractAddress={contractAddress ?? ""}
      tokenType={tokenType ?? ""}
      imageUrl={imageUrl ?? ""}
      instanceName={instanceName ?? ""}
      username={username ?? ""}
    />
  );
}