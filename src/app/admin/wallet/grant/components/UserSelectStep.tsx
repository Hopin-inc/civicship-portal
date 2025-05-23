"use client";

import Image from "next/image";
import { GqlUser } from "@/types/graphql";
import { PLACEHOLDER_IMAGE } from "@/utils";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  members: { user: GqlUser; wallet: { currentPointView?: { currentPoint: number } } }[];
  onSelect: (user: GqlUser) => void;
}

function UserSelectStep({ members, onSelect }: Props) {
  return (
    <>
      <p className="px-4 text-sm text-muted-foreground">渡す相手を選んでください</p>
      <div className="space-y-3 px-4">
        {members?.map(({ user, wallet }) => (
          <Card
            key={user.id}
            onClick={() => onSelect(user)}
            className="cursor-pointer hover:bg-accent transition"
          >
            <CardHeader className="flex flex-row items-center gap-3 p-4">
              <Image
                src={user.image ?? PLACEHOLDER_IMAGE}
                alt={user.name ?? "要確認"}
                width={40}
                height={40}
                className="rounded-full object-cover border"
                style={{ aspectRatio: "1 / 1" }}
              />
              <div className="flex flex-col text-left">
                <CardTitle className="text-base font-medium truncate max-w-[160px]">
                  {user.name}
                </CardTitle>
                <CardDescription>
                  保有pt: {wallet.currentPointView?.currentPoint?.toLocaleString() ?? 0}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
}

export default UserSelectStep;
