"use client";

import { useQuery } from "@apollo/client";
import { GET_COMMUNITIES } from "@/graphql/queries/community";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Locate, Users } from "lucide-react";
import CommunityEditModal from "@/app/communities/CommunityEditModal";
import CommunityDeleteModal from "@/app/communities/CommunityDeleteModal";
import React, { Suspense } from "react";
import { SortDirection } from "@/gql/graphql";

const CommunityList: React.FC = () => {
  const { data } = useQuery(GET_COMMUNITIES, {
    variables: {
      filter: {},
      sort: { createdAt: SortDirection.Desc },
      first: 10,
    },
    fetchPolicy: "no-cache",
  });

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {data?.communities.edges?.map((e) => {
        const community = e?.node;
        return (
          community && (
            <li key={community.id} className="list-none ml-0">
              <Card>
                <CardHeader>
                  <CardTitle>{community.name}</CardTitle>
                  <CardDescription>{community.bio || "説明がありません"}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 text-muted-foreground">
                  <p className="flex gap-1">
                    <Locate />
                    {community.city?.name || "地域未設定"}
                  </p>
                  <p className="flex gap-1">
                    <Users />
                    {community.memberships?.length || 0} メンバー
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Suspense>
                    <CommunityEditModal id={community.id} />
                  </Suspense>
                  <Suspense>
                    <CommunityDeleteModal id={community.id} />
                  </Suspense>
                </CardFooter>
              </Card>
            </li>
          )
        );
      })}
    </ul>
  );
};

export default CommunityList;
