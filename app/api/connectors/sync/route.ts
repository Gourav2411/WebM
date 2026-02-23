import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { connector } = await req.json();
  return NextResponse.json({
    ok: true,
    mode: "mock",
    connector,
    inserted: 5000,
    message: "Integration disabled temporarily. Returned mock sync result."
  });
}
