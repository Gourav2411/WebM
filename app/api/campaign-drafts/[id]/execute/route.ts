import { NextRequest, NextResponse } from "next/server";
import { executeDraft } from "@/lib/agent/tools";
import { getUserContext, getWorkspaceId } from "@/lib/workspace";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const workspaceId = getWorkspaceId(req);
  const { userId, role } = getUserContext(req);
  const result = await executeDraft(workspaceId, params.id, userId, role);
  return NextResponse.json(result);
}
