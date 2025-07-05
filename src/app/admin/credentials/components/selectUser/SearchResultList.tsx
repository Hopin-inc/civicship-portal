import React, { useMemo } from "react";
import { MemberRow } from "./Member";
import { GqlUser, GqlParticipationStatusReason, GqlMembershipEdge, useGetDidIssuanceRequestsQuery, useGetVcIssuanceRequestsByUserQuery, GqlDidIssuanceRequest } from "@/types/graphql";

interface SearchResultListProps {
  searchQuery: string;
  searchMembershipData: (GqlUser & { didInfo?: GqlDidIssuanceRequest })[];
  selectedUserIds: string[];
  handleCheck: (userId: string) => void;
  getParticipatedReason: (userId: string) => GqlParticipationStatusReason | undefined;
  DISABLED_REASONS: GqlParticipationStatusReason[];
}

const SearchResultList: React.FC<SearchResultListProps> = ({
  searchQuery,
  searchMembershipData,
  selectedUserIds,
  handleCheck,
  getParticipatedReason,
  DISABLED_REASONS,
}) => {
  const visibleUserIds = useMemo(() => {
    const userIds: string[] = [];
      searchMembershipData.forEach(({ id, ...user }) => {
        if (user) {
          userIds.push(id);
      }
    });
    return userIds;
  }, [searchQuery, searchMembershipData]);
  // VC発行リクエストを一括取得
  const { data: vcIssuanceRequestsData } = useGetVcIssuanceRequestsByUserQuery({
    variables: {
      userIds: visibleUserIds,
    },
    skip: visibleUserIds.length === 0,
  });
  return (
    <>
      {searchMembershipData.length === 0 && (
        <p className="text-sm text-muted-foreground">一致するメンバーが見つかりません</p>
      )}
      {searchMembershipData.map(({ didInfo, ...user }) => {
        const reason = getParticipatedReason(user.id);
        const isDisabled = reason !== undefined && DISABLED_REASONS.includes(reason as GqlParticipationStatusReason);
        return (
          <div key={user.id} className="flex flex-col gap-4">
            <MemberRow
              user={user}
              checked={selectedUserIds.includes(user.id)}
              onCheck={() => handleCheck(user.id)}
              isDisabled={isDisabled}
              reason={reason}
              didInfo={didInfo}
              vcIssuanceRequestsData={vcIssuanceRequestsData}
            />
          </div>
        );
      })}
    </>
  );
};

export default SearchResultList; 