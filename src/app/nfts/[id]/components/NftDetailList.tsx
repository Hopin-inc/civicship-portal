import { Card, CardHeader } from "@/components/ui/card";
import { Copy } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { truncateDid } from "../page";

interface NftDetailListProps {
    didValue: string;
    instanceId: string;
    contractAddress: string;
    tokenType: string;
    imageUrl: string;
    instanceName: string;
    username: string;
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
            alt="証明書"
            width={120}
            height={120}
            className="object-cover border-none shadow-none mx-auto rounded-sm"
        />
        <h1 className="text-body-sm font-bold w-[70%] mx-auto mt-4">{props.instanceName}</h1>
      </div>
    </div>
    <div className="mt-6 p-4">
      <div className="grid grid-cols-1 gap-4 relative">
        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none">
          <CardHeader className="flex flex-row items-center justify-between p-6">
            {/* 左側 */}
            <div className="text-gray-400 text-xs font-bold">保有者</div>
            {/* 右側 */}
            <div className="flex flex-col items-end">
              <div className="text-sm font-bold text-black">{props.username}</div>
              <div className="flex items-center text-gray-400 text-sm mt-1">
                <button
                  onClick={() => copyToClipboard(props.didValue ?? "", "DID")}
                  className="flex items-center hover:opacity-70 transition-opacity"
                  aria-label="DIDをコピー"
                >
                  <Copy className="w-4 h-4 mr-1" />
                </button>
                <span>{truncateDid(props.didValue, 15)}</span>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none">
          <CardHeader className="flex flex-row items-center justify-between p-4 px-6">
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
                <span>{truncateDid(props.instanceId, 15)}</span>
              </div>
          </CardHeader>
        </Card>

        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none">
          <CardHeader className="flex flex-row items-center justify-between p-6">
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
                <span>{truncateDid(props.contractAddress, 15)}</span>
              </div>
          </CardHeader>
        </Card>

        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none">
          <CardHeader className="flex flex-row items-center justify-between p-6">
            <div className="text-gray-400 text-xs font-bold min-w-fit whitespace-nowrap">
              チェーン
            </div>
            <div className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm ml-2 flex-2">
              Ethereum
            </div>
          </CardHeader>
        </Card>

        <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none">
          <CardHeader className="flex flex-row items-center justify-between p-6">
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