import { Card, CardHeader } from "@/components/ui/card";
import { GqlGetParticipationQuery, useGetDidIssuanceRequestsQuery } from "@/types/graphql";
import { formatDateTime } from "@/utils/date";
import { Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface OpportunityListProps {
    opportunity: GqlGetParticipationQuery | undefined
}

export default function OpportunityList(props: OpportunityListProps) {
    const { opportunity } = props;
    
    // 主催者のDIDを取得
    const { data: organizerDidData } = useGetDidIssuanceRequestsQuery({
        variables: {
          userId: opportunity?.participation?.opportunitySlot?.opportunity?.createdByUser?.id ?? "",
        },
        skip: !opportunity?.participation?.opportunitySlot?.opportunity?.createdByUser?.id,
    });

    // 参加者のDIDを取得
    const { data: participantDidData } = useGetDidIssuanceRequestsQuery({
        variables: {
          userId: opportunity?.participation?.user?.id ?? "",
        },
        skip: !opportunity?.participation?.user?.id,
    });

    const organizerDid = organizerDidData?.user?.didIssuanceRequests?.[0]?.id;
    const participantDid = participantDidData?.user?.didIssuanceRequests?.[0]?.id;

    return (
        <div className="grid grid-cols-1 gap-4">
            <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
                <CardHeader className="flex flex-row items-center justify-between p-6">
                    {/* 左側 */}
                    <div className="text-gray-400 text-base font-bold">主催者</div>
                    {/* 右側 */}
                    <div className="flex flex-col items-end">
                    <div className="text-lg font-bold text-black">{opportunity?.participation?.opportunitySlot?.opportunity?.createdByUser?.name}</div>
                        <div className="flex items-center text-gray-400 text-sm mt-1">
                            <Copy 
                                className="w-4 h-4 mr-1" 
                                onClick={() => {
                                    navigator.clipboard.writeText(organizerDid ?? "");
                                    toast.success("コピーしました");
                                }}
                            />
                            <span>did:key:{organizerDid}</span>
                        </div>
                    </div>
                </CardHeader>
            </Card>
            <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
            <CardHeader className="flex flex-row items-center justify-between p-4 px-6">
                <div className="text-gray-400 text-base min-w-fit whitespace-nowrap">概要</div>
                <div className="flex items-center flex-1 min-w-0 ml-2">
                    <span className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm flex-1">
                        {opportunity?.participation?.opportunitySlot?.opportunity?.description}
                    </span>
                    <Link
                        href={`/activities/${opportunity?.participation?.opportunitySlot?.opportunity?.id}?community_id=${opportunity?.participation?.opportunitySlot?.opportunity?.community?.id}`}
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
                    <div className="text-gray-400 text-base font-bold min-w-fit whitespace-nowrap">参加者</div>
                    <div className="flex flex-col items-end">
                    <div className="text-lg font-bold text-black">{opportunity?.participation?.user?.name}</div>
                        <div className="flex items-center text-gray-400 text-sm mt-1">
                            <Copy 
                                className="w-4 h-4 mr-1" 
                                onClick={() => {
                                    navigator.clipboard.writeText(participantDid ?? "");
                                    toast.success("コピーしました");
                                }}
                            />
                            <span>did:key:{participantDid}</span>
                        </div>
                    </div>
                </CardHeader>
            </Card>
            <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
                <CardHeader className="flex flex-row items-center justify-between p-6">
                    <div className="text-gray-400 text-base font-bold min-w-fit whitespace-nowrap">開始日時</div>
                    <div className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm ml-2 flex-2">
                    {formatDateTime(opportunity?.participation?.opportunitySlot?.startsAt ?? new Date(), "yyyy/MM/dd HH:mm")}
                    </div>
                </CardHeader>
            </Card>
            <Card className="rounded-2xl border border-gray-200 bg-[#FCFCFC] shadow-none ">
                <CardHeader className="flex flex-row items-center justify-between p-6">
                    <div className="text-gray-400 text-base font-bold min-w-fit whitespace-nowrap">終了日時</div>
                    <div className="font-bold text-black whitespace-nowrap overflow-hidden text-ellipsis text-sm ml-2 flex-2">
                        {formatDateTime(opportunity?.participation?.opportunitySlot?.endsAt ?? new Date(), "yyyy/MM/dd HH:mm")}
                    </div>
                </CardHeader>
            </Card>
        </div>
    )
}