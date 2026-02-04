"use client";

import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useGetNftInstancesQuery } from "@/types/graphql";
import { useCommunityConfig } from "@/contexts/CommunityConfigContext";
import { NftList } from "./components/NftList";
import { NftItemData } from "./components/NftItem";

export default function AdminNftsPage() {
  const communityConfig = useCommunityConfig();
  const communityId = communityConfig?.communityId ?? "";
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
        communityId,
      },
    },
    fetchPolicy: "network-only",
  });

  const nftInstances: NftItemData[] =
    data?.nftInstances?.edges
      .map((edge) => edge.node)
      .filter((node) => node != null)
      .map((node) => ({
        id: node.id,
        name: node.name,
        imageUrl: node.imageUrl,
        instanceId: node.instanceId,
        communityId: node.community?.id,
        createdAt: node.createdAt.toString(),
        nftWallet: node.nftWallet
          ? {
              user: {
                name: node.nftWallet.user.name,
              },
            }
          : null,
      })) || [];

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <NftList nftInstances={nftInstances} loading={loading} error={error || null} />
    </div>
  );
}
