import React from "react";
import { MemberRow } from "./Member";
import { GqlUser, GqlParticipationStatusReason, GqlMembershipEdge } from "@/types/graphql";

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
            />
          </div>
        );
      })}
    </>
  );
};

export default SearchResultList; 