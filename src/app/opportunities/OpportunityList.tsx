"use client";

import { useQuery } from "@apollo/client";
import { GET_OPPORTUNITIES } from "@/graphql/queries/opportunity";
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

const OpportunityList: React.FC = () => {
  const { data } = useQuery(GET_OPPORTUNITIES, {
    variables: {
      filter: {},
      sort: { createdAt: SortDirection.Desc },
      first: 10,
    },
    fetchPolicy: "no-cache",
  });

  return (
    <main className="min-h-screen p-24">
      <h1 className="text-2xl font-bold mb-8">募集一覧</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.opportunities.edges?.map((e) => {
          const opportunity = e?.node;
          return (
            opportunity && (
              <li key={opportunity.id} className="list-none ml-0">
                <Link href={`/opportunities/${opportunity.id}`} passHref>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{opportunity.title || "タイトル未設定"}</CardTitle>
                      <CardDescription>
                        {opportunity.description || "説明がありません"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p>クリックして詳細を表示</p>
                    </CardContent>
                  </Card>
                </Link>
              </li>
            )
          );
        })}
      </ul>
    </main>
  );
};

export default OpportunityList;
