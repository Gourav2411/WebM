import { NextRequest, NextResponse } from "next/server";

const SYSTEM_NOTE = "Mock agent mode enabled. External integrations are temporarily disabled.";

export async function POST(req: NextRequest) {
  const { message } = await req.json();
  return NextResponse.json({
    reply: `${SYSTEM_NOTE}\nYou said: ${message}\nSuggested action: create a mock campaign draft for review.`
  });
}
