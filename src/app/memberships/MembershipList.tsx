"use client";

import { useQuery } from "@apollo/client";
import { GET_MEMBERSHIPS } from "@/graphql/queries/membership";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Building, User } from "lucide-react";
// import MembershipEditModal from "@/app/memberships/MembershipEditModal";
// import MembershipDeleteModal from "@/app/memberships/MembershipDeleteModal";
import React, { Suspense } from "react";
import { SortDirection } from "@/gql/graphql";

const MembershipList: React.FC = () => {
  const { data } = useQuery(GET_MEMBERSHIPS, {
    variables: {
      filter: {},
      sort: { createdAt: SortDirection.Desc },
      first: 10,
    },
    fetchPolicy: "no-cache",
  });

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {data?.memberships.edges?.map((e) => {
        const membership = e?.node;
        return (
          membership && (
            <li key={`${membership.user.id}-${membership.community.id}`} className="list-none ml-0">
              <Card>
                <CardHeader>
                  <CardTitle>{membership.user?.name || "ユーザー未設定"}</CardTitle>
                  <CardDescription>
                    {membership.community?.name || "コミュニティ未設定"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-1 text-muted-foreground">
                  <p className="flex gap-1">
                    <Building />
                    {membership.community?.name || "コミュニティ未設定"}
                  </p>
                  <p className="flex gap-1">
                    <User />
                    {membership.role || "役割未設定"}
                  </p>
                </CardContent>
                {/*<CardFooter className="flex gap-2">*/}
                {/*  <Suspense>*/}
                {/*    <MembershipEditModal userId={membership.user.id} communityId={membership.community.id} />*/}
                {/*  </Suspense>*/}
                {/*  <Suspense>*/}
                {/*    <MembershipDeleteModal userId={membership.user.id} communityId={membership.community.id} />*/}
                {/*  </Suspense>*/}
                {/*</CardFooter>*/}
              </Card>
            </li>
          )
        );
      })}
    </ul>
  );
};

export default MembershipList;
