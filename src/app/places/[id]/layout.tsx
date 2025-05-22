//TODO ピュアにplaceから取得できればuserIdをわざわざparamに加えなくても解決する

// import { Metadata } from "next";
// import { COMMUNITY_ID, DEFAULT_OGP } from "@/utils";
// import {
//   GetSingleMembershipDocument,
//   GqlGetSingleMembershipQuery,
//   GqlGetSingleMembershipQueryVariables,
//   GqlMembership,
// } from "@/types/graphql";
// import { apolloClient } from "@/lib/apollo";
// import { fallbackMetadata } from "@/lib/metadata";
//
// export const generateMetadata = async ({
//   params,
// }: {
//   params: { id: string };
// }): Promise<Metadata> => {
//   const id = params.id;
//   const res = await fetchArticle(id, COMMUNITY_ID);
//
//   if (!res) return fallbackMetadata;
//
//   return {
//     title: res.title,
//     description: res.introduction ?? res.body,
//     openGraph: {
//       title: res.title,
//       description: res.introduction ?? res.body,
//       images: [
//         {
//           url: res.thumbnail ?? DEFAULT_OGP,
//           width: 1200,
//           height: 630,
//           alt: res.title,
//         },
//       ],
//     },
//   };
// };
//
// async function fetchMembership(id: string, communityId: string): Promise<GqlMembership | null> {
//   const { data } = await apolloClient.query<
//     GqlGetSingleMembershipQuery,
//     GqlGetSingleMembershipQueryVariables
//   >({
//     query: GetSingleMembershipDocument,
//     variables: { id, permission: { communityId } },
//   });
//
//   return data.membership ?? null;
// }

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
