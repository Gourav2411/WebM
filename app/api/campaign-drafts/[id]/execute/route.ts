import { NextRequest, NextResponse } from "next/server";

export async function POST(_: NextRequest, { params }: { params: { id: string } }) {
  return NextResponse.json({ id: params.id, status: "EXECUTED", mode: "mock", executed: false, message: "Execution mocked" });
}
