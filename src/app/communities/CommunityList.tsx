"use client";

import { useQuery } from "@apollo/client";
import { GET_COMMUNITIES } from "@/graphql/queries/community";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import React from "react";
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
              <Link href={`/communities/${community.id}`} passHref>
                <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle>{community.name || "名前未設定"}</CardTitle>
                    <CardDescription>{community.bio || "説明がありません"}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <p>{community.city?.name || "地域未設定"}</p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          )
        );
      })}
    </ul>
  );
};

export default CommunityList;
