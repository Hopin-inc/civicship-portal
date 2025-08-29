import { GqlUser, useGetNftInstancesQuery } from "@/types/graphql";

interface UseUserNftProps {
    userId: GqlUser["id"];
}

export const useUserNfts = ({ userId }: UseUserNftProps) => {
    const { data: nftInstances } = useGetNftInstancesQuery(
      {
        variables: {
          filter: {
            userId: [userId],
          },
        },
        fetchPolicy: "cache-first",
        skip: !userId,
      }
    );
    return {
      nftInstances: nftInstances?.nftInstances?.edges?.map(edge => edge.node) ?? [],
    };
};
