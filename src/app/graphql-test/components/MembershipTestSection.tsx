"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { useMembershipQueries } from "../hooks/useMembershipQueries";
import { useMembershipMutations } from "../hooks/useMembershipMutations";
import { useCommunities } from "../hooks/useCommunities";
import { useUsersByCommunity } from "../hooks/useUsersByCommunity";
import ResultDisplay from "./ResultDisplay";

export default function MembershipTestSection() {
  const [communityId, setCommunityId] = useState("");
  const [userId, setUserId] = useState("");
  const [queryResult, setQueryResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const { communities, isLoading: communitiesLoading } = useCommunities();
  const { users, isLoading: usersLoading } = useUsersByCommunity(communityId);
  const { getSingleMembership, getMembershipList } = useMembershipQueries();
  const { assignOwner, assignManager, assignMember } = useMembershipMutations();
  
  useEffect(() => {
    setUserId("");
  }, [communityId]);

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
            <label className="block text-sm font-medium mb-1">Community</label>
            <Select
              value={communityId}
              onValueChange={setCommunityId}
              disabled={communitiesLoading || isLoading}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a community" />
              </SelectTrigger>
              <SelectContent>
                {communities.map((community) => (
                  <SelectItem key={community.id} value={community.id}>
                    {community.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {communitiesLoading && <p className="text-sm text-muted-foreground mt-1">Loading communities...</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">User</label>
            <Select
              value={userId}
              onValueChange={setUserId}
              disabled={usersLoading || isLoading || !communityId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder={communityId ? "Select a user" : "Select a community first"} />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {usersLoading && <p className="text-sm text-muted-foreground mt-1">Loading users...</p>}
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
