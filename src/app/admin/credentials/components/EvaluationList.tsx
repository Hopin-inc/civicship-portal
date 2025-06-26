"use client";

import Loading from "@/components/layout/Loading";
import { Card } from "@/components/ui/card";
import { GqlEvaluationStatus, useGetEvaluationsQuery } from "@/types/graphql";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";

export default function EvaluationList() {
    const router = useRouter();
    const { data, loading, error } = useGetEvaluationsQuery();
    if (loading) return <Loading />;
    if (error) return <div>Error: {error.message}</div>;
    const evaluationList = data?.evaluations.edges
        ?.filter((evaluation) => evaluation.node?.status === GqlEvaluationStatus.Passed)
        .sort((a, b) => {
            const aDate = a.node?.createdAt ? new Date(a.node.createdAt).getTime() : 0;
            const bDate = b.node?.createdAt ? new Date(b.node.createdAt).getTime() : 0;
            return bDate - aDate; // 降順（新しい順）
        });

    // slotIdごとにevaluationをグループ化
    const slotEvaluationsMap = evaluationList
      ? evaluationList.reduce((acc, evaluation) => {
          const slotId = evaluation.node?.participation?.opportunitySlot?.id;
          if (!slotId) return acc;
          if (!acc[slotId]) acc[slotId] = [];
          acc[slotId].push(evaluation);
          return acc;
        }, {} as Record<string, typeof evaluationList>)
      : {};

    // slotIdごとに1つだけ表示（代表evaluationを使う）
    const uniqueSlotEvaluations = Object.entries(slotEvaluationsMap).map(([slotId, evaluations]) => ({
      slotId,
      evaluations,
      representative: evaluations[0], // 代表として1つだけ使う
    }));

    return (
        <div className="space-y-4">
            {uniqueSlotEvaluations.length === 0 ? <div className="text-[#71717A]">証明書はまだありません</div> :
                uniqueSlotEvaluations.map(({ slotId, evaluations, representative }) => {
                    // すべてのvcIssuanceRequestをまとめて配列化
                    const allRequests = evaluations.flatMap(ev => ev.node?.vcIssuanceRequest ?? []);
                    const denominator = allRequests.length;
                    const numerator = allRequests.filter(req => req?.status === "COMPLETED").length;
                    const hasPending = allRequests.some(req => req?.status === "PENDING");
                    const hasFailed = allRequests.some(req => req?.status === "FAILED");

                    const node = representative.node;
                    const title = node?.participation?.opportunitySlot?.opportunity?.title ?? "";
                    const start = node?.participation?.opportunitySlot?.startsAt
                        ? new Date(node.participation.opportunitySlot.startsAt)
                        : null;
                    const end = node?.participation?.opportunitySlot?.endsAt
                        ? new Date(node.participation.opportunitySlot.endsAt)
                        : null;
                    const issuedAt = node?.createdAt
                        ? new Date(node.createdAt).toLocaleDateString("ja-JP", { year: "numeric", month: "numeric", day: "numeric" })
                        : "";

                    return (
                        <Card
                            key={node?.id}
                            className="rounded-xl border border-gray-200 p-4 flex flex-col cursor-pointer"
                            onClick={() => router.push(`/admin/credentials/${node?.id}`)}
                        >
                            <div className="flex-1">
                                <div className="font-bold text-lg truncate" style={{ maxWidth: "100%" }}>
                                    {title}
                                </div>
                                <div className="text-gray-500 text-sm mt-1">
                                    {start && end
                                        ? `${start.getFullYear()}年${start.getMonth() + 1}月${start.getDate()}日~${end.getMonth() + 1}月${end.getDate()}日`
                                        : ""}
                                </div>
                            </div>
                            <div className="flex justify-between items-end mt-4">
                                <div className="text-gray-400 text-sm flex items-center">
                                    <span>発行数</span>
                                    {hasFailed ? <AlertTriangle className="text-red-400 w-5 h-5 mx-1" />  : hasPending && <AlertTriangle className="text-yellow-400 w-5 h-5 mx-1" />}
                                    <span className="font-bold text-lg text-black mx-1">{numerator}</span>
                                    <span>/</span>
                                    <span>{denominator}</span>
                                </div>
                                <div className="text-gray-400 text-sm">{issuedAt}</div>
                            </div>
                        </Card>
                    );
                })}
        </div>
    );
}