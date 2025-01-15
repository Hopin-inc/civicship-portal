"use client";

import { useQuery } from "@apollo/client";
import { GET_ACTIVITIES } from "@/graphql/queries/activity";
import { SortDirection } from "@/gql/graphql";
import {
  Card,
  CardContent,
  CardDescription, CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Building, Clock, User } from "lucide-react";
import { displayDuration, displayName } from "@/utils";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import ActivityEditModal from "@/app/activities/ActivityEditModal";
import ActivityDeleteModal from "@/app/activities/ActivityDeleteModal";
import { Suspense } from "react";

const ActivityList: React.FC = () => {
  const { data } = useQuery(GET_ACTIVITIES, {
    variables: {
      filter: { isPublic: true },
      sort: { startsAt: SortDirection.Desc },
      first: 10,
    },
    fetchPolicy: "no-cache",
  });

  return (
    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
      {data?.activities.edges?.map((e) => {
        const activity = e?.node;
        return (
          activity && (
            <li key={activity.id} className="list-none ml-0">
              <Card>
                {/*<Link href={`/activities/${activity.id}`} passHref className="card-link">*/}
                  <CardHeader>
                    <CardTitle>{activity.id}</CardTitle>
                    {activity.event && (
                      <CardDescription>{activity.event?.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="flex flex-col gap-1 text-muted-foreground">
                    <p className="flex gap-1">
                      <Clock />
                      {displayDuration(activity.startsAt, activity.endsAt)}
                    </p>
                    <p className="flex gap-1">
                      <User />
                      {activity.user ? displayName(activity.user) : "ユーザー未設定"}
                    </p>
                    <p className="flex gap-1">
                      <Building />
                      {activity.organization ? activity.organization.name : "団体未設定"}
                    </p>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Suspense>
                      <ActivityEditModal id={activity.id} />
                    </Suspense>
                    <Suspense>
                      <ActivityDeleteModal id={activity.id} />
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

export default ActivityList;
