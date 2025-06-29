import Image from "next/image";
import { GqlUser, useGetDidIssuanceRequestsQuery, GqlParticipationStatusReason } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { Input } from "@/components/ui/input";

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
  const { data: didIssuanceRequestsData } = useGetDidIssuanceRequestsQuery({
    variables: {
      userIds: [user.id],
    },
  });

  const did = didIssuanceRequestsData?.users?.edges?.[0]?.node?.didIssuanceRequests?.[0]?.didValue;
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
      disabled={!did || isDisabled}
    />
    {/* ユーザー画像 */}
    <Image
      src={user.image ?? PLACEHOLDER_IMAGE}
      alt={user.name ?? "要確認"}
      width={40}
      height={40}
      className="rounded-full object-cover border"
      style={{ aspectRatio: "1 / 1" }}
    />
    {/* ユーザー情報 */}
    <div className="flex flex-col ml-4 min-w-0">
      {isDisabled && reason === GqlParticipationStatusReason.ReservationAccepted && (
         <span className="text-green-500 text-xs font-semibold mb-1">
          指定された募集に申込済み
        </span>
      )}
      {isDisabled && reason === GqlParticipationStatusReason.PersonalRecord && (
        <span className="text-green-500 text-xs font-semibold mb-1">
          指定された募集で証明書発行済み
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
