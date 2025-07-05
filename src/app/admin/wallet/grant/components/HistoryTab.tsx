"use client";

import React from "react";
import { GqlUser } from "@/types/graphql";
import UserInfoCard from "./UserInfoCard";
import { useWalletsAndDidIssuanceRequests } from "../hooks/useWalletsAndDidIssuanceRequests";
import { useAuth } from "@/contexts/AuthProvider";
import Loading from "@/components/layout/Loading";

interface HistoryTabProps {
  listType: "donate" | "grant";
  searchQuery: string;
  onSelect: (user: GqlUser) => void;
}

export function HistoryTab({ listType, searchQuery, onSelect }: HistoryTabProps) {
  const { user } = useAuth();
  const {
    error,
    presentedTransactions,
    loading,
  } = useWalletsAndDidIssuanceRequests({ 
    userId: user?.id, 
    listType, 
    keyword: searchQuery 
  });

  if (error) {
    return (
      <div className="space-y-3 px-4">
        <p className="text-sm text-center text-red-500 pt-4">
          履歴の読み込みに失敗しました
        </p>
      </div>
    );
  }

  if (presentedTransactions.length === 0) {
    return (
      <div className="space-y-3 px-4">
        <p className="text-sm text-center text-muted-foreground pt-4">
          支給履歴がありません
        </p>
      </div>
    );
  }

  if (loading) <Loading />

  return (
    <div className="space-y-3 px-4">
      {presentedTransactions.map((tx, index) => (
        <UserInfoCard
          key={`${tx.otherUser?.id}-${index}`}
          otherUser={tx.otherUser}
          label={tx.label}
          point={tx.point}
          sign={tx.sign}
          pointColor={tx.pointColor}
          didValue={tx.didValue ?? "did取得中"}
          createdAt={tx.createdAt}
          onClick={() => {
            if (tx.otherUser) onSelect(tx.otherUser);
          }}
        />
      ))}
    </div>
  );
} 