"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMembershipQueries } from "../hooks/useMembershipQueries";
import { useMembershipMutations } from "../hooks/useMembershipMutations";
import ResultDisplay from "./ResultDisplay";

export default function MembershipTestSection() {
  const [communityId, setCommunityId] = useState("");
  const [userId, setUserId] = useState("");
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { getSingleMembership, getMembershipList } = useMembershipQueries();
  const { assignOwner, assignManager, assignMember } = useMembershipMutations();

  const handleGetSingleMembership = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getSingleMembership(communityId, userId);
      setQueryResult(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetMembershipList = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getMembershipList();
      setQueryResult(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignOwner = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await assignOwner({
        userId,
        communityId,
      });
      setQueryResult(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignManager = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await assignManager({
        userId,
        communityId,
      });
      setQueryResult(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignMember = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await assignMember({
        userId,
        communityId,
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
        <h2 className="text-xl font-semibold">Membership Operations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Community ID</label>
            <Input
              value={communityId}
              onChange={(e) => setCommunityId(e.target.value)}
              placeholder="Enter community ID"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">User ID</label>
            <Input
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Enter user ID"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button onClick={handleGetSingleMembership} disabled={isLoading || !communityId || !userId}>
            Get Single Membership
          </Button>
          <Button onClick={handleGetMembershipList} disabled={isLoading}>
            Get Membership List
          </Button>
          <Button onClick={handleAssignOwner} disabled={isLoading || !communityId || !userId}>
            Assign Owner
          </Button>
          <Button onClick={handleAssignManager} disabled={isLoading || !communityId || !userId}>
            Assign Manager
          </Button>
          <Button onClick={handleAssignMember} disabled={isLoading || !communityId || !userId}>
            Assign Member
          </Button>
        </div>
      </div>

      <ResultDisplay result={queryResult} isLoading={isLoading} error={error} />
    </div>
  );
}
