import { useMemo } from "react";
import {
  GqlDidIssuanceRequest,
  GqlDidIssuanceStatus,
  GqlGetNftInstanceWithDidQuery,
} from "@/types/graphql";
import {
  detectChain,
  detectChainFromAddress,
  getChainDisplayName,
  getExplorerUrl,
} from "./blockchainExplorer";

export function useNftDetailData(nftInstance: GqlGetNftInstanceWithDidQuery["nftInstance"]) {
  const basic = useMemo(() => {
    if (!nftInstance) {
      return {
        instanceId: undefined,
        imageUrl: undefined,
        instanceName: undefined,
        instanceJson: undefined,
        contractAddress: undefined,
        tokenType: undefined,
        username: undefined,
        didValue: undefined,
        communityId: undefined,
      };
    }

    const { instanceId, imageUrl, name: instanceName, json: instanceJson } = nftInstance;
    const { address: contractAddress, type: tokenType } = nftInstance.nftToken ?? {};
    const { name: username } = nftInstance.nftWallet?.user ?? {};
    const communityId = nftInstance.community?.id;
    const didValue = nftInstance.nftWallet?.user?.didIssuanceRequests?.find(
      (request: GqlDidIssuanceRequest) => request.status === GqlDidIssuanceStatus.Completed,
    )?.didValue;

    return {
      instanceId,
      imageUrl,
      instanceName,
      instanceJson,
      contractAddress,
      tokenType,
      username,
      didValue,
      communityId,
    };
  }, [nftInstance]);

  const blockchain = useMemo(() => {
    const chain = detectChain(basic.tokenType) || detectChainFromAddress(basic.contractAddress);
    const chainDisplayName = chain ? getChainDisplayName(chain) : undefined;
    const assetNameHex =
      chain === "cardano" && basic.instanceId ? basic.instanceId.split("-")[1] : undefined;
    const explorerUrl =
      chain && basic.contractAddress
        ? getExplorerUrl({
            chain,
            instanceId: basic.instanceId,
            contractOrPolicyAddress: basic.contractAddress,
            assetNameHex,
            metadata: basic.instanceJson,
          })
        : undefined;

    return {
      chain,
      chainDisplayName,
      assetNameHex,
      explorerUrl,
    };
  }, [basic.tokenType, basic.instanceId, basic.contractAddress, basic.instanceJson]);

  return { basic, blockchain };
}
