import { useMemo } from "react";
import { GqlDidIssuanceStatus, GqlGetNftInstanceWithDidQuery, GqlDidIssuanceRequest } from "@/types/graphql";
import {
  detectChain,
  detectChainFromAddress,
  getExplorerUrl,
  getChainDisplayName,
  extractCardanoAssetNameHex,
} from "@/lib/blockchain";

export function useNftDetailData(nftInstance: GqlGetNftInstanceWithDidQuery['nftInstance']) {
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
      };
    }

    const { instanceId, imageUrl, name: instanceName, json: instanceJson } = nftInstance;
    const { address: contractAddress, type: tokenType } = nftInstance.nftToken ?? {};
    const { name: username } = nftInstance.nftWallet?.user ?? {};
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
    };
  }, [nftInstance]);

  const blockchain = useMemo(() => {
    const chain = detectChain(basic.tokenType) || detectChainFromAddress(basic.contractAddress);
    const chainDisplayName = chain ? getChainDisplayName(chain) : undefined;
    const assetNameHex = chain === 'cardano' ? extractCardanoAssetNameHex(basic.instanceJson) : undefined;
    const explorerUrl = chain && basic.contractAddress ? getExplorerUrl({
      chain,
      contractOrPolicyAddress: basic.contractAddress,
      assetNameHex,
      metadata: basic.instanceJson,
    }) : undefined;

    return {
      chain,
      chainDisplayName,
      assetNameHex,
      explorerUrl,
    };
  }, [basic.tokenType, basic.contractAddress, basic.instanceJson]);

  return { basic, blockchain };
}
