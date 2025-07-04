import { Card, CardHeader } from "@/components/ui/card";
import { GqlDidIssuanceStatus, GqlGetParticipationQuery, useGetVcIssuanceRequestByEvaluationQuery } from "@/types/graphql";
import { formatDateTime } from "@/utils/date";
import { Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import Image from "next/image";
import { CredentialRole, renderStatusCard } from "@/app/admin/credentials/[id]/data/presenter";

interface OpportunityListProps {
    data: GqlGetParticipationQuery | undefined
}

const truncateDid = (did: string | undefined | null, length: number = 20): string => {
    if (!did) return "";
    if (did.length <= length) return did;
    const start = did.substring(0, length);
    const end = did.substring(did.length - 10);
    return `${start}...${end}`;
};

export default function CredentialList(props: OpportunityListProps) {
    const { data } = props;
    const { data: vcData } = useGetVcIssuanceRequestByEvaluationQuery({
        variables: { evaluationId: data?.participation?.evaluation?.id ?? "" },
        skip: !data?.participation?.evaluation?.id,
    });

    const organizerDid = data?.participation?.opportunitySlot?.opportunity?.createdByUser?.didIssuanceRequests?.find(req => req?.status === GqlDidIssuanceStatus.Completed)?.didValue 
    const participantDid = data?.participation?.evaluation?.participation?.user?.didIssuanceRequests?.find(req => req?.status === GqlDidIssuanceStatus.Completed)?.didValue

    return (
        <>
        <div className="w-full h-auto mt-4">
        <div className="flex justify-center mt-6">
        {renderStatusCard(vcData?.vcIssuanceRequests.edges[0]?.node?.status ?? "PENDING", CredentialRole.member)}
        </div>
        <Image
            src="/images/credentials/organizer-Info-logo.png"
            alt="証明書"
            width={400}
            height={400}
            className="w-full h-auto object-cover border-none shadow-none mt-6"
            />
        </div>
        <div className="mt-6 p-4">

        <div className="grid grid-cols-1 gap-4 relative">
            <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
                <CardHeader className="flex flex-row items-center justify-between p-6">
                    {/* 左側 */}
                    <div className="text-gray-400 text-xs font-bold">主催者</div>
                    {/* 右側 */}
                    <div className="flex flex-col items-end">
                    <div className="text-sm font-bold text-black">{data?.participation?.opportunitySlot?.opportunity?.createdByUser?.name}</div>
                        <div className="flex items-center text-gray-400 text-sm mt-1">
                            <Copy 
                                className="w-4 h-4 mr-1" 
                                onClick={() => {
                                    navigator.clipboard.writeText(organizerDid ?? "");
                                    toast.success("コピーしました");
                                }}
                            />
                            <span>{truncateDid(organizerDid ?? "",15)}</span>
                        </div>
                    </div>
                </CardHeader>
            </Card>
            <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
                <CardHeader className="flex flex-row items-center justify-between p-4 px-6">
                    <div className="flex items-center h-8 text-gray-400 text-xs min-w-fit whitespace-nowrap">
                        概要
                    </div>
                    <div className="flex items-center flex-1 min-w-0 ml-8 h-8">
                        <span className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm flex-1">
                            {data?.participation?.opportunitySlot?.opportunity?.title}
                        </span>
                        <Link
                            href={`/activities/${data?.participation?.opportunitySlot?.opportunity?.id}?community_id=${data?.participation?.opportunitySlot?.opportunity?.community?.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2"
                        >
                            <ExternalLink className="w-4 h-4 text-gray-400" />
                        </Link>
                    </div>
                </CardHeader>
            </Card>
            <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
                <CardHeader className="flex flex-row items-center justify-between p-6">
                    <div className="text-gray-400 text-xs font-bold min-w-fit whitespace-nowrap">参加者</div>
                    <div className="flex flex-col items-end">
                    <div className="text-sm font-bold text-black">{data?.participation?.user?.name}</div>
                        <div className="flex items-center text-gray-400 text-sm mt-1">
                            <Copy 
                                className="w-4 h-4 mr-1" 
                                onClick={() => {
                                    navigator.clipboard.writeText(participantDid ?? "");
                                    toast.success("コピーしました");
                                }}
                            />
                            <span>{truncateDid(participantDid ?? "",15)}</span>
                        </div>
                    </div>
                </CardHeader>
            </Card>
            <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
                <CardHeader className="flex flex-row items-center justify-between p-6">
                    <div className="text-gray-400 text-xs font-bold min-w-fit whitespace-nowrap">開始日時</div>
                    <div className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm ml-2 flex-2">
                    {formatDateTime(data?.participation?.opportunitySlot?.startsAt ?? new Date(), "yyyy年MM月dd日 HH:mm")}
                    </div>
                </CardHeader>
            </Card>
            <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
                <CardHeader className="flex flex-row items-center justify-between p-6">
                    <div className="text-gray-400 text-xs font-bold min-w-fit whitespace-nowrap">終了日時</div>
                    <div className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm ml-2 flex-2">
                        {formatDateTime(data?.participation?.opportunitySlot?.endsAt ?? new Date(), "yyyy年MM月dd日 HH:mm")}
                    </div>
                </CardHeader>
            </Card>
            {vcData?.vcIssuanceRequests.edges[0]?.node?.completedAt && (
                <div className="text-gray-400 text-sm text-right mt-4">
                    発行日 {formatDateTime(vcData?.vcIssuanceRequests.edges[0]?.node?.completedAt, "yyyy年M月d日")}
                </div>
            )}
        </div>
        </div>
        </>
    )
}