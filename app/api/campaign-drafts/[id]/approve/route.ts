import { NextRequest, NextResponse } from "next/server";

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ id: params.id, status: "APPROVED", mode: "mock" });
}
