import { NextRequest, NextResponse } from "next/server";
import serverLogger from "@/lib/logging/server/index";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { level = "info", message, meta = {} } = body;

    if (!message) {
      return NextResponse.json({ error: "Missing log message" }, { status: 400 });
    }

    if (!["debug", "info", "warn", "error"].includes(level)) {
      return NextResponse.json({ error: "Invalid log level" }, { status: 400 });
    }

    const enrichedMeta = {
      ...meta,
      source: "client",
      timestamp: new Date().toISOString(),
    };

    switch (level) {
      case "debug":
        serverLogger.debug(message, enrichedMeta);
        break;
      case "info":
        serverLogger.info(message, enrichedMeta);
        break;
      case "warn":
        serverLogger.warn(message, enrichedMeta);
        break;
      case "error":
        serverLogger.error(message, enrichedMeta);
        break;
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    serverLogger.error("Client log API error", {
      component: "ClientLogAPI",
      error: error instanceof Error ? error.message : String(error),
    });
    return NextResponse.json({ error: "Failed to process log" }, { status: 500 });
  }
}
