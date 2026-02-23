import { NextRequest, NextResponse } from "next/server";
import { syncQueue } from "@/lib/jobs/queue";

export async function POST(req: NextRequest) {
  const { workspaceId, connector } = await req.json();
  await syncQueue.add("manual-sync", { workspaceId, connector });
  return NextResponse.json({ ok: true });
}
