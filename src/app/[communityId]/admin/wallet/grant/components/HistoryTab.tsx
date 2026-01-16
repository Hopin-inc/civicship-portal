"use client";

import React, { useEffect, useState } from "react";
import { GqlUser } from "@/types/graphql";
import { useWalletsAndDidIssuanceRequests } from "../hooks/useWalletsAndDidIssuanceRequests";
import { useAuth } from "@/contexts/AuthProvider";
import Loading from "@/components/layout/Loading";
import { useTranslations } from "next-intl";
import { Table, TableBody } from "@/components/ui/table";
import { UserPointRow } from "@/components/shared/UserPointRow";

interface HistoryTabProps {
  listType: "donate" | "grant";
  searchQuery: string;
  onSelect: (user: GqlUser) => void;
}

export function HistoryTab({ listType, searchQuery, onSelect }: HistoryTabProps) {
  const t = useTranslations();
  const { user } = useAuth();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { error, presentedTransactions, loading, refetch } = useWalletsAndDidIssuanceRequests({
    currentUserId: user?.id,
    listType,
    keyword: searchQuery,
  });
  useEffect(() => {
    refetch();
  }, [refetch]);

  if (error) {
    return (
      <div className="space-y-3 px-4">
        <p className="text-sm text-center text-red-500 pt-4">
          {t("wallets.shared.history.errorLoad")}
        </p>
      </div>
    );
  }

  if (!loading && presentedTransactions.length === 0) {
    return (
      <div className="space-y-3 px-4">
        <p className="text-sm text-center text-muted-foreground pt-4">
          {listType === "grant"
            ? t("wallets.shared.history.noGrant")
            : t("wallets.shared.history.noDonation")}
        </p>
      </div>
    );
  }

  if (loading) return <Loading />;

  const handleSelect = (user: GqlUser) => {
    // すでに選択されているユーザーをクリックした場合は選択解除
    if (selectedUserId === user.id) {
      setSelectedUserId(null);
      return;
    }

    setSelectedUserId(user.id);
    onSelect(user);
  };

  return (
    <div className="px-4">
      <Table className={"max-w-xl"}>
        <TableBody>
          {presentedTransactions.map((tx, index) => {
            if (!tx.otherUser) return null;

            const subText = tx.createdAt
              ? new Date(tx.createdAt.toString()).toLocaleDateString()
              : tx.didValue
                ? `${tx.didValue.substring(0, 16)}...`
                : "";

            return (
              <UserPointRow
                key={`${tx.otherUser.id}-${index}`}
                avatar={tx.otherUser.image || ""}
                name={tx.otherUser.name || tx.otherName || ""}
                subText={subText}
                pointValue={Number(tx.point || 0)}
                onClick={() => {
                  if (tx.otherUser) handleSelect(tx.otherUser);
                }}
                selected={selectedUserId === tx.otherUser.id}
              />
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
