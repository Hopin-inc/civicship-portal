"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransactionQueries } from "../hooks/useTransactionQueries";
import { useTransactionMutations } from "../hooks/useTransactionMutations";
import ResultDisplay from "./ResultDisplay";

export default function TransactionTestSection() {
  const [userId, setUserId] = useState("");
  const [communityId, setCommunityId] = useState("");
  const [amount, setAmount] = useState("0");
  const [reason, setReason] = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { getTransactions, getTransaction } = useTransactionQueries();
  const { issuePoint, grantPoint, donatePoint } = useTransactionMutations();

  const handleGetTransactions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getTransactions({ userId });
      setQueryResult(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetTransaction = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getTransaction(transactionId);
      setQueryResult(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleIssuePoint = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await issuePoint({
        userId,
        communityId,
        amount: Number(amount),
        reason,
      });
      setQueryResult(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGrantPoint = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await grantPoint({
        userId,
        communityId,
        amount: Number(amount),
        reason,
      });
      setQueryResult(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDonatePoint = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await donatePoint({
        toUserId: userId,
        communityId,
        amount: Number(amount),
        reason,
      });
      setQueryResult(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4 border rounded-lg p-4">
        <h2 className="text-xl font-semibold">Transaction Operations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">User ID</label>
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Community ID</label>
            <Input
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
              placeholder="Enter community ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Transaction ID (for single query)</label>
            <Input
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder="Enter transaction ID"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleGetTransactions} disabled={isLoading}>
            Get Transactions
          </Button>
          <Button onClick={handleGetTransaction} disabled={isLoading || !transactionId}>
            Get Transaction
          </Button>
          <Button onClick={handleIssuePoint} disabled={isLoading || !userId || !communityId}>
            Issue Point
          </Button>
          <Button onClick={handleGrantPoint} disabled={isLoading || !userId || !communityId}>
            Grant Point
          </Button>
          <Button onClick={handleDonatePoint} disabled={isLoading || !userId || !communityId}>
            Donate Point
          </Button>
        </div>
      </div>

      <ResultDisplay result={queryResult} isLoading={isLoading} error={error} />
    </div>
  );
}
