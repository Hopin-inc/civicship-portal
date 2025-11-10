import { NextRequest, NextResponse } from "next/server";
import { getServerCommunityTransactionsWithCursor } from "@/hooks/transactions/server-community-transactions";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get("cursor") || undefined;
    const first = parseInt(searchParams.get("first") || "20", 10);

    const transactions = await getServerCommunityTransactionsWithCursor(cursor, first);

    return NextResponse.json(transactions, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Failed to fetch community transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
