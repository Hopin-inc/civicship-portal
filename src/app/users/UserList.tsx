"use client";

import { useQuery } from "@apollo/client";
import { GET_USERS } from "@/graphql/queries/user";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import UserEditProfileModal from "@/app/users/UserEditProfileModal";
import React, { Suspense } from "react";
import { SortDirection } from "@/gql/graphql";

const UserList: React.FC = () => {
  const { data } = useQuery(GET_USERS, {
    variables: {
      filter: {},
      sort: { createdAt: SortDirection.Desc },
      first: 10,
    },
    fetchPolicy: "no-cache",
  });

  return (
    <main className="min-h-screen p-24">
      <h1 className="text-2xl font-bold mb-8">ユーザー一覧</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.users.edges?.map((e) => {
          const user = e?.node;
          return (
            user && (
              <li key={user.id} className="list-none ml-0">
                <Link href={`/users/${user.id}`} passHref>
                  <Card className="cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>{user.name || "名前未設定"}</CardTitle>
                      <CardDescription>{user.bio || "説明がありません"}</CardDescription>
                    </CardHeader>
                    <CardContent className="text-sm text-muted-foreground">
                      <p>クリックして詳細を表示</p>
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Suspense>
                        <UserEditProfileModal id={user.id} />
                      </Suspense>
                    </CardFooter>
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

export default UserList;
