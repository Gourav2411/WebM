import { NextRequest, NextResponse } from "next/server";
import { createConnection, listConnections } from "@/lib/mock-store";
import { allPlatforms } from "@/lib/platform-config";

function getWorkspaceId(req: NextRequest) {
  return req.headers.get("x-workspace-id") || req.nextUrl.searchParams.get("workspaceId") || "ws_seed";
}

export async function GET(req: NextRequest) {
  const workspaceId = getWorkspaceId(req);
  return NextResponse.json({ connections: listConnections(workspaceId) });
}

export async function POST(req: NextRequest) {
  const workspaceId = getWorkspaceId(req);
  const body = (await req.json()) as {
    platformKey: string;
    platformName: string;
    category: "analytics" | "ads" | "crm" | "cdp";
    values: Record<string, string>;
  };

  const platform = allPlatforms.find((p) => p.key === body.platformKey);
  if (!platform) return NextResponse.json({ error: "Unknown platform" }, { status: 400 });

  const missing = platform.fields.filter((f) => f.required && !body.values?.[f.key]);
  if (missing.length > 0) {
    return NextResponse.json({ error: `Missing required fields: ${missing.map((m) => m.label).join(", ")}` }, { status: 400 });
  }

  const connection = createConnection({ workspaceId, ...body });
  return NextResponse.json({ ok: true, connection });
}
