"use client";
import useSearchResultHeader from "@/app/search/result/components/SearchResultHeader";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function QuestHeader({ id }: { id?: string }) {
    const searchParams = useSearchParams();

    const queryParams = useMemo(
      () => ({
        location: searchParams.get("location") ?? undefined,
        from: searchParams.get("from") ?? undefined,
        to: searchParams.get("to") ?? undefined,
        guests: searchParams.get("guests") ?? undefined,
        type: searchParams.get("type") as "quest" | undefined,
        ticket: searchParams.get("ticket") ?? undefined,
        points: searchParams.get("points") ?? undefined,
        q: searchParams.get("q") ?? undefined,
        redirectTo: id ? `/quests/${id}` : "/quests",
      }),
      [searchParams],
    );
    useSearchResultHeader(queryParams);

    return null;
}