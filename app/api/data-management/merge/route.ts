import { NextRequest, NextResponse } from "next/server";
import { createMerged } from "@/lib/data-management-mock";

function wid(req: NextRequest) {
  return req.nextUrl.searchParams.get("workspaceId") || req.headers.get("x-workspace-id") || "ws_seed";
}

export async function POST(req: NextRequest) {
  const workspaceId = wid(req);
  const body = (await req.json()) as { leftSource: string; rightSource: string; joinKey: string; name: string };
  if (!body.leftSource || !body.rightSource || !body.joinKey || !body.name) {
    return NextResponse.json({ error: "leftSource, rightSource, joinKey, and name are required" }, { status: 400 });
  }
  const merged = createMerged(workspaceId, body.leftSource, body.rightSource, body.joinKey, body.name);
  return NextResponse.json({ ok: true, merged });
}
