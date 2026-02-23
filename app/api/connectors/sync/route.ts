import { NextRequest, NextResponse } from "next/server";
import { getSyncQueue } from "@/lib/jobs/queue";
import { ga4Connector, amplitudeConnector } from "@/lib/connectors/analytics";
import { getWorkspaceId } from "@/lib/workspace";

const connectors = {
  ga4: ga4Connector,
  amplitude: amplitudeConnector
} as const;

export async function POST(req: NextRequest) {
  const workspaceId = getWorkspaceId(req);
  const { connector } = await req.json();
  if (!(connector in connectors)) {
    return NextResponse.json({ error: "Unknown connector" }, { status: 400 });
  }

  const queue = getSyncQueue();
  if (queue) {
    await queue.add("manual-sync", { workspaceId, connector });
    return NextResponse.json({ ok: true, mode: "queued" });
  }

  const result = await connectors[connector as keyof typeof connectors].sync(workspaceId);
  return NextResponse.json({ ok: true, mode: "inline", result });
}
