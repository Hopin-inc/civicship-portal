import React, { useMemo } from "react";
import { MemberRow } from "./Member";
import { GqlUser, GqlParticipationStatusReason, GqlMembershipEdge, useGetDidIssuanceRequestsQuery, useGetVcIssuanceRequestsByUserQuery } from "@/types/graphql";

interface SearchResultListProps {
  searchQuery: string;
  singleMembershipData: any;
  sortedMembers: { user: GqlUser }[];
  selectedUserIds: string[];
  handleCheck: (userId: string) => void;
  getParticipatedReason: (userId: string) => GqlParticipationStatusReason | undefined;
  DISABLED_REASONS: GqlParticipationStatusReason[];
}

const SearchResultList: React.FC<SearchResultListProps> = ({
  searchQuery,
  singleMembershipData,
  sortedMembers,
  selectedUserIds,
  handleCheck,
  getParticipatedReason,
  DISABLED_REASONS,
}) => {
  const visibleUserIds = useMemo(() => {
    const userIds: string[] = [];
    if (searchQuery && singleMembershipData?.memberships?.edges.length > 0) {
      singleMembershipData.memberships.edges.forEach((edge: GqlMembershipEdge) => {
        if (edge.node?.user?.id) {
          userIds.push(edge.node.user.id);
        }
      });
    } else {
      sortedMembers.forEach(({ user }) => {
        userIds.push(user.id);
      });
    }
    
    return userIds;
  }, [searchQuery, singleMembershipData, sortedMembers]);
  // DID発行リクエストを一括取得
  const { data: didIssuanceRequestsData } = useGetDidIssuanceRequestsQuery({
    variables: {
      userIds: visibleUserIds,
    },
    skip: visibleUserIds.length === 0,
  });
  // VC発行リクエストを一括取得
  const { data: vcIssuanceRequestsData } = useGetVcIssuanceRequestsByUserQuery({
    variables: {
      userIds: visibleUserIds,
    },
    skip: visibleUserIds.length === 0,
  });

  if (searchQuery && singleMembershipData?.memberships?.edges.length > 0) {
    return (
      <>
        {singleMembershipData.memberships.edges.map((edge:GqlMembershipEdge) => {
          const reason = getParticipatedReason(edge.node?.user?.id ?? "");
          const isDisabled = reason !== undefined && DISABLED_REASONS.includes(reason as GqlParticipationStatusReason);

          const user = edge.node?.user;
          if (!user) return null;
          return (
            <MemberRow
              key={user.id}
              user={user}
              checked={selectedUserIds.includes(user.id)}
              onCheck={() => handleCheck(user.id)}
              isDisabled={isDisabled}
              reason={reason}
              didIssuanceRequestsData={didIssuanceRequestsData}
              vcIssuanceRequestsData={vcIssuanceRequestsData}
            />
          );
        })}
      </>
    );
  }

  return (
    <>
      {sortedMembers.length === 0 && (
        <p className="text-sm text-muted-foreground">一致するメンバーが見つかりません</p>
      )}
      {sortedMembers.map(({ user }) => {
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
              didIssuanceRequestsData={didIssuanceRequestsData}
              vcIssuanceRequestsData={vcIssuanceRequestsData}
            />
          </div>
        );
      })}
    </>
  );
};

export default SearchResultList; 