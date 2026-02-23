import { NextRequest, NextResponse } from "next/server";
import { analyzeMerged } from "@/lib/data-management-mock";

function wid(req: NextRequest) {
  return req.nextUrl.searchParams.get("workspaceId") || req.headers.get("x-workspace-id") || "ws_seed";
}

export async function POST(req: NextRequest) {
  const workspaceId = wid(req);
  const body = (await req.json()) as { mergedDatasetId: string; prompt: string };
  if (!body.mergedDatasetId) return NextResponse.json({ error: "mergedDatasetId is required" }, { status: 400 });
  const result = analyzeMerged(workspaceId, body.mergedDatasetId, body.prompt || "");
  if ("error" in result) return NextResponse.json(result, { status: 404 });
  return NextResponse.json({ ok: true, analysis: result });
}
