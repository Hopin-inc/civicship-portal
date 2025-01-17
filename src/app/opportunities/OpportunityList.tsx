"use client";

import { useQuery } from "@apollo/client";
import { GET_OPPORTUNITIES } from "@/graphql/queries/opportunity";
import { PublishStatus, SortDirection } from "@/gql/graphql";
import {
  Card,
  CardContent,
  CardDescription, CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Building, Clock, Locate, Tag, User, Wallet } from "lucide-react";
import { displayDuration } from "@/utils";
import OpportunityEditModal from "@/app/opportunities/OpportunityEditModal";
import OpportunityDeleteModal from "@/app/opportunities/OpportunityDeleteModal";
import React, { Suspense } from "react";

const OpportunityList: React.FC = () => {
  const { data } = useQuery(GET_OPPORTUNITIES, {
    variables: {
      filter: { publishStatus: PublishStatus.Public },
      sort: { createdAt: SortDirection.Desc },
      first: 10,
    },
    fetchPolicy: "no-cache",
  });

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {data?.opportunities.edges?.map((e) => {
        const opportunity = e?.node;
        return (
          opportunity && (
            <li key={opportunity.id} className="list-none ml-0">
              <Card>
                {/*<Link href={`/activities/${opportunity.id}`} passHref className="card-link">*/}
                <CardHeader>
                  <CardTitle>{opportunity.title}</CardTitle>
                  <CardDescription>{opportunity.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 text-muted-foreground">
                  <p className="flex gap-1">
                    <Tag />
                    {opportunity.category ? opportunity.category : "カテゴリ未設定"}
                  </p>
                  <p className="flex gap-1">
                    <Clock />
                    {opportunity.startsAt && opportunity.endsAt
                      ? displayDuration(opportunity.startsAt, opportunity.endsAt)
                      : "期間未設定"}
                  </p>
                  <p className="flex gap-1">
                    <User />
                    {opportunity.createdBy ? opportunity.createdBy.name : "作成者未設定"}
                  </p>
                  <p className="flex gap-1">
                    <Building />
                    {opportunity.community ? opportunity.community.name : "団体未設定"}
                  </p>
                  <p className="flex gap-1">
                    <Locate />
                    {opportunity.city ? opportunity.city.name : "地域未設定"}
                  </p>
                  <p className="flex gap-1">
                    <Wallet />
                    {opportunity.pointsPerParticipation
                      ? opportunity.pointsPerParticipation
                      : "0ポイント"}
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Suspense>
                    <OpportunityEditModal id={opportunity.id} />
                  </Suspense>
                  <Suspense>
                    <OpportunityDeleteModal id={opportunity.id} />
                  </Suspense>
                </CardFooter>
                {/*</Link>*/}
              </Card>
            </li>
          )
        );
      })}
    </ul>
  );
};

export default OpportunityList;
