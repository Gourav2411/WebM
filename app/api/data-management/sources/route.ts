import { NextRequest, NextResponse } from "next/server";
import { listMerged, listSources } from "@/lib/data-management-mock";

function wid(req: NextRequest) {
  return req.nextUrl.searchParams.get("workspaceId") || req.headers.get("x-workspace-id") || "ws_seed";
}

export async function GET(req: NextRequest) {
  const workspaceId = wid(req);
  return NextResponse.json({ sources: listSources(workspaceId), merged: listMerged(workspaceId) });
}
