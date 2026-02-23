import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUserContext, getWorkspaceId } from "@/lib/workspace";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const workspaceId = getWorkspaceId(req);
  const { userId } = getUserContext(req);
  const draft = await prisma.campaignDraft.findFirst({ where: { id: params.id, workspaceId } });
  if (!draft) return NextResponse.json({ error: "Draft not found" }, { status: 404 });

  const updated = await prisma.campaignDraft.update({ where: { id: draft.id }, data: { status: "APPROVED" } });
  await logAudit(workspaceId, "draft.approved", userId, { draftId: draft.id });
  return NextResponse.json(updated);
}
