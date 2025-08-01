import { useGetNftInstancesQuery } from "@/types/graphql";
interface UseUserNftProps {
    userId: string;
}
export const useUserNft = ({ userId }: UseUserNftProps) => {
    const { data: nftInstances } = useGetNftInstancesQuery(
      {
        variables: {
          filter: {
            userId: [userId],
          },
        },
        fetchPolicy: "network-only",
        skip: !userId,
      }
    );
    return {
      nftInstances: nftInstances?.nftInstances?.edges?.map(edge => edge.node) ?? [],
    };
};