import { Card, CardHeader } from "@/components/ui/card";
import { Copy, Info } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { truncateText } from "@/utils/stringUtils";
import { GqlDidIssuanceRequest, GqlGetNftInstanceWithDidQuery } from "@/types/graphql";

type NftInstanceData = NonNullable<GqlGetNftInstanceWithDidQuery["nftInstance"]>;
type NftTokenData = NonNullable<NftInstanceData["nftToken"]>;
type NftWalletData = NonNullable<NftInstanceData["nftWallet"]>;

interface NftDetailListProps {
    didValue?: GqlDidIssuanceRequest["didValue"];
    instanceId: NftInstanceData["instanceId"];
    contractAddress: NftTokenData["address"];
    tokenType: NftTokenData["type"];
    imageUrl: NftInstanceData["imageUrl"];
    instanceName: NftInstanceData["name"];
    username: NftWalletData["user"]["name"];
}

const copyToClipboard = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("コピーしました");
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    toast.error("コピーに失敗しました");
  }
};

export const NftDetailList = (props: NftDetailListProps) => {
  return (
    <>
    <div className="flex justify-center mt-10">
      <div>
        <Image
            src={props.imageUrl ?? ""}
            alt={props.instanceName ?? "証明書"}
            width={120}
            height={120}
            className="object-cover border-none shadow-none mx-auto rounded-sm"
        />
        <h1 className="text-title-sm font-bold w-[70%] mx-auto mt-4 text-center">{props.instanceName}</h1>
      </div>
    </div>
    <div className="mt-6 p-4">
      <div className="grid grid-cols-1 gap-4 relative">
        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none">
          <CardHeader className="flex flex-row items-center justify-between py-4 px-6">
            {/* 左側 */}
            <div className="text-gray-400 text-xs font-bold">保有者</div>
            {/* 右側 */}
            <div className="flex flex-col items-end">
              <div className="text-sm font-bold text-black">{props.username}</div>
              <div className="flex items-center text-gray-400 text-sm mt-1">
                {!props.didValue ? (
                  <div className="flex items-center gap-1">
                    <Info className="w-4 h-4 text-[#EAB308]" />
                    <span className="text-label-sm">did発行準備中</span>
                  </div>
                ) : (
                  <button
                    onClick={() => copyToClipboard(props.didValue ?? "", "DID")}
                    className="flex items-center hover:opacity-70 transition-opacity"
                  aria-label="DIDをコピー"
                  >
                    <Copy className="w-4 h-4 mr-1" />
                  </button>
                )}
                <span>{truncateText(props.didValue, 15)}</span>
              </div>
            </div>
          </CardHeader>
        </Card>
        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none">
          <CardHeader className="flex flex-row items-center justify-between py-4 px-6">
            <div className="flex items-center h-8 text-gray-400 text-xs min-w-fit whitespace-nowrap">
              証明書ID
            </div>
            <div className="flex items-center text-gray-400 text-sm mt-1">
                <button
                  onClick={() => copyToClipboard(props.instanceId ?? "", "証明書ID")}
                  className="flex items-center hover:opacity-70 transition-opacity"
                  aria-label="証明書IDをコピー"
                >
                  <Copy className="w-4 h-4 mr-1" />
                </button>
                <span>{truncateText(props.instanceId, 15)}</span>
              </div>
          </CardHeader>
        </Card>

        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none">
          <CardHeader className="flex flex-row items-center justify-between py-4 px-6">
            <div className="text-gray-400 text-xs font-bold min-w-fit whitespace-nowrap">
              コントラクト<br/>アドレス
            </div>
            <div className="flex items-center text-gray-400 text-sm mt-1">
                <button
                  onClick={() => copyToClipboard(props.contractAddress ?? "", "コントラクトアドレス")}
                  className="flex items-center hover:opacity-70 transition-opacity"
                  aria-label="コントラクトアドレスをコピー"
                >
                  <Copy className="w-4 h-4 mr-1" />
                </button>
                <span>{truncateText(props.contractAddress, 15)}</span>
              </div>
          </CardHeader>
        </Card>

        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none">
          <CardHeader className="flex flex-row items-center justify-between py-4 px-6">
            <div className="text-gray-400 text-xs font-bold min-w-fit whitespace-nowrap">
              チェーン
            </div>
            <div className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm ml-2 flex-2">
              Ethereum
            </div>
          </CardHeader>
        </Card>

        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none">
          <CardHeader className="flex flex-row items-center justify-between py-4 px-6">
            <div className="text-gray-400 text-xs font-bold min-w-fit whitespace-nowrap">
              規格
            </div>
            <div className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm ml-2 flex-2">
              {props.tokenType}
            </div>
          </CardHeader>
        </Card>
      </div>
    </div>
  </>
  );
};