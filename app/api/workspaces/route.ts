import { NextRequest, NextResponse } from "next/server";
import { createWorkspace, listWorkspaces } from "@/lib/mock-store";

export async function GET() {
  return NextResponse.json({ workspaces: listWorkspaces() });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { name: string; industry?: string; website?: string };
  if (!body.name?.trim()) return NextResponse.json({ error: "Workspace name is required" }, { status: 400 });
  const workspace = createWorkspace({ name: body.name.trim(), industry: body.industry, website: body.website });
  return NextResponse.json({ ok: true, workspace });
}
