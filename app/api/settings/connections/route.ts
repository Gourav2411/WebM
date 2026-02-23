import { NextRequest, NextResponse } from "next/server";

export type Connection = {
  id: string;
  workspaceId: string;
  platformKey: string;
  platformName: string;
  category: "analytics" | "ads";
  values: Record<string, string>;
  createdAt: string;
};

const store = new Map<string, Connection[]>();

function getWorkspaceId(req: NextRequest) {
  return req.headers.get("x-workspace-id") || req.nextUrl.searchParams.get("workspaceId") || "ws_seed";
}

export async function GET(req: NextRequest) {
  const workspaceId = getWorkspaceId(req);
  return NextResponse.json({ connections: store.get(workspaceId) || [] });
}

export async function POST(req: NextRequest) {
  const workspaceId = getWorkspaceId(req);
  const body = (await req.json()) as Omit<Connection, "id" | "workspaceId" | "createdAt">;
  const connection: Connection = {
    id: `conn_${Date.now()}`,
    workspaceId,
    createdAt: new Date().toISOString(),
    ...body
  };
  const prev = store.get(workspaceId) || [];
  store.set(workspaceId, [connection, ...prev]);
  return NextResponse.json({ ok: true, connection });
}
