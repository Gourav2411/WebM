import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const workspaceId = "ws_seed";

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status") || undefined;
  const drafts = await prisma.campaignDraft.findMany({ where: { workspaceId, status: status as never } });
  return NextResponse.json(drafts);
}
