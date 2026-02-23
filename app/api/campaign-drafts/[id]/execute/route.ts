import { NextRequest, NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { executeDraft } from "@/lib/agent/tools";

const workspaceId = "ws_seed";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { userId = "seed_user", role = Role.ADMIN } = await req.json();
  const result = await executeDraft(workspaceId, params.id, userId, role);
  return NextResponse.json(result);
}
