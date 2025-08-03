"use client";
import { use, useMemo } from "react";
import { GqlDidIssuanceStatus, useGetNftInstanceWithDidQuery } from "@/types/graphql";
import { NftDetailList } from "@/components/domains/nfts/components";
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

  const nftInstance = nftInstanceWithDid.nftInstance;
  const { 
    instanceId, 
    imageUrl, 
    name: instanceName 
  } = nftInstance;
  
  const { 
    address: contractAddress, 
    type: tokenType 
  } = nftInstance.nftToken ?? {};
  
  const { 
    name: username 
  } = nftInstance.nftWallet?.user ?? {};
  
  const didValue = nftInstance.nftWallet?.user?.didIssuanceRequests?.find(
    request => request.status === GqlDidIssuanceStatus.Completed
  )?.didValue;

  return (
    <NftDetailList
      didValue={didValue ?? ""}
      instanceId={instanceId}
      contractAddress={contractAddress ?? ""}
      tokenType={tokenType ?? ""}
      imageUrl={imageUrl}
      instanceName={instanceName}
      username={username ?? ""}
    />
  );
}