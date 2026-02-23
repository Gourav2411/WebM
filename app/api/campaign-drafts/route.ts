import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getWorkspaceId } from "@/lib/workspace";

export async function GET(req: NextRequest) {
  const workspaceId = getWorkspaceId(req);
  const status = req.nextUrl.searchParams.get("status") || undefined;
  const drafts = await prisma.campaignDraft.findMany({ where: { workspaceId, ...(status ? { status: status as never } : {}) } });
  return NextResponse.json(drafts);
}
