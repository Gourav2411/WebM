import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const workspaceId = "ws_seed";

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  const draft = await prisma.campaignDraft.update({ where: { id: params.id, workspaceId }, data: { status: "APPROVED" } });
  return NextResponse.json(draft);
}
