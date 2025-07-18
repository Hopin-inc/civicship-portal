import {
  GqlDidIssuanceRequest,
  GqlGetVcIssuanceRequestsByUserQuery,
  GqlParticipationStatusReason,
  GqlUser,
  GqlVcIssuanceStatus,
} from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { Input } from "@/components/ui/input";
import { useSelection } from "../../context/SelectionContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface Props {
  user: GqlUser & { didInfo?: GqlDidIssuanceRequest };
  checked: boolean;
  onCheck: () => void;
  isDisabled: boolean;
  reason?: GqlParticipationStatusReason;
  didInfo?: GqlDidIssuanceRequest | undefined ;
  vcIssuanceRequestsData?: GqlGetVcIssuanceRequestsByUserQuery;
}

const truncateDid = (did: string | undefined | null, length: number = 20): string => {
  if (!did) return "";
  if (did.length <= length) return did;
  const start = did.substring(0, length);
  const end = did.substring(did.length - 10);
  return `${start}...${end}`;
};

export const MemberRow = ({ user, checked, onCheck, isDisabled, reason, didInfo, vcIssuanceRequestsData }: Props) => {
  const { selectedSlot } = useSelection();
  const did = didInfo?.didValue;
  const hasCompletedVcIssuanceRequest =
    !!vcIssuanceRequestsData?.vcIssuanceRequests.edges.find(
      (edge) =>
        edge.node?.evaluation?.participation?.opportunitySlot?.id === selectedSlot?.slotId &&
        edge.node?.status === GqlVcIssuanceStatus.Completed &&
        edge.node?.user?.id === user.id
    );

  const hasProcessingVcIssuanceRequest =
    !!vcIssuanceRequestsData?.vcIssuanceRequests.edges.find(
      (edge) =>
        edge.node?.evaluation?.participation?.opportunitySlot?.id === selectedSlot?.slotId &&
        (edge.node?.status === GqlVcIssuanceStatus.Processing || edge.node?.status === GqlVcIssuanceStatus.Pending) &&
        edge.node?.user?.id === user.id
    );

  const cardBgClass = !did || isDisabled ? "bg-zinc-200" : "bg-white";

  return (
    <Card
      className={`flex items-center gap-3 rounded-xl border transition-colors px-4 py-3 cursor-pointer ${cardBgClass}`}
    >
      {/* チェックボックス */}
      <Input
        type="checkbox"
        checked={checked}
        onChange={onCheck}
        className="w-4 h-4 mr-4"
        name="user-select"
        disabled={
          !did || isDisabled || hasCompletedVcIssuanceRequest || hasProcessingVcIssuanceRequest
        }
      />
      {/* ユーザー画像 */}
      <Avatar>
        <AvatarImage src={user.image ?? PLACEHOLDER_IMAGE} />
        <AvatarFallback>{user.name?.[0] ?? "U"}</AvatarFallback>
      </Avatar>
      {/* ユーザー情報 */}
      {/* isDisabledはタップ不可になる可能性のフラグ*/}
      <div className="flex flex-col ml-4">
        {isDisabled && reason === GqlParticipationStatusReason.ReservationAccepted && (
          <span className="text-green-500 text-xs font-semibold mb-1">
            指定された募集に申込済み
          </span>
        )}
        {isDisabled &&
          hasCompletedVcIssuanceRequest &&
          reason === GqlParticipationStatusReason.PersonalRecord && (
            <span className="text-green-500 text-xs font-semibold mb-1">
              指定された募集で証明書発行済み
            </span>
          )}
        {isDisabled &&
          hasProcessingVcIssuanceRequest &&
          reason === GqlParticipationStatusReason.PersonalRecord && (
            <span className="text-warning text-xs font-semibold mb-1">
              指定された募集で証明書発行中
            </span>
          )}
        <span className={`${did ? "font-bold text-base text-black" : "text-gray-400 text-base"} truncate max-w-[160px]`}>
          {user.name}
        </span>
        <span className="text-gray-400 text-sm max-w-[200px]">
          {did ? truncateDid(did, 10) : "did発行中"}
        </span>
      </div>
    </Card>
  );
};
