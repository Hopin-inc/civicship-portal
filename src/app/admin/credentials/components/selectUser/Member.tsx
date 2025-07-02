import Image from "next/image";
import { GqlUser, useGetDidIssuanceRequestsQuery, GqlParticipationStatusReason, useGetVcIssuanceRequestsByUserQuery, GqlVcIssuanceStatus, GqlDidIssuanceStatus } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { Input } from "@/components/ui/input";
import { useSelection } from "../../context/SelectionContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  user: GqlUser;
  checked: boolean;
  onCheck: () => void;
  isDisabled: boolean;
  reason?: GqlParticipationStatusReason;
}

const truncateDid = (did: string | undefined | null, length: number = 20): string => {
  if (!did) return "";
  if (did.length <= length) return did;
  const start = did.substring(0, length);
  const end = did.substring(did.length - 10);
  return `${start}...${end}`;
};

export const MemberRow = ({ user, checked, onCheck, isDisabled, reason }: Props) => {
  const { selectedSlot } = useSelection();
  const { data: didIssuanceRequestsData } = useGetDidIssuanceRequestsQuery({
    variables: {
      userIds: [user.id],
    },
  });

  const { data } = useGetVcIssuanceRequestsByUserQuery({
    variables: {
      userId: user.id,
    },
  });
  const hasCompletedVcIssuanceRequest =
    !!data?.vcIssuanceRequests.edges.find(
      (edge) =>
        edge.node?.evaluation?.participation?.opportunitySlot?.id === selectedSlot?.slotId &&
        edge.node?.status === GqlVcIssuanceStatus.Completed
    );

  const hasProcessingVcIssuanceRequest =
    !!data?.vcIssuanceRequests.edges.find(
      (edge) =>
        edge.node?.evaluation?.participation?.opportunitySlot?.id === selectedSlot?.slotId &&
        edge.node?.status === GqlVcIssuanceStatus.Processing
    );

  const did = didIssuanceRequestsData?.users?.edges?.[0]?.node?.didIssuanceRequests?.find(
    (request) => request.status === GqlDidIssuanceStatus.Completed
  )?.didValue;
  const cardBgClass = !did || isDisabled ? "bg-zinc-200" : "bg-white";
  
  return (
    <div className={`flex items-center border border-gray-200 rounded-xl px-4 py-3 w-full max-w-lg ${cardBgClass}`}>
    {/* チェックボックス */}
    <Input
      type="checkbox"
      checked={checked}
      onChange={onCheck}
      className="w-4 h-4 mr-4"
      name="user-select"
      disabled={!did || isDisabled || hasCompletedVcIssuanceRequest || hasProcessingVcIssuanceRequest}
    />
    {/* ユーザー画像 */}
    <Avatar>
      <AvatarImage src={user.image ?? PLACEHOLDER_IMAGE} />
      <AvatarFallback>
        {user.name?.[0] ?? "U"}
      </AvatarFallback>
    </Avatar>
    {/* ユーザー情報 */}
    <div className="flex flex-col ml-4 min-w-0">
      {isDisabled && reason === GqlParticipationStatusReason.ReservationAccepted && (
         <span className="text-green-500 text-xs font-semibold mb-1">
          指定された募集に申込済み
        </span>
      )}
      {isDisabled && hasCompletedVcIssuanceRequest && reason === GqlParticipationStatusReason.PersonalRecord && (
        <span className="text-green-500 text-xs font-semibold mb-1">
          指定された募集で証明書発行済み
        </span>
      )}
      {isDisabled && hasProcessingVcIssuanceRequest && reason === GqlParticipationStatusReason.PersonalRecord && (
        <span className="text-warning text-xs font-semibold mb-1">
          指定された募集で証明書発行中
        </span>
      )}
      <span className={`${did ? "font-bold text-base text-black" : "text-gray-400 text-base"}`}>
        {user.name}
      </span>
      <span className="text-gray-400 text-sm max-w-[160px]">
        {did ? truncateDid(did,20) : "did発行中"}
      </span>
    </div>
  </div>
  );
};
