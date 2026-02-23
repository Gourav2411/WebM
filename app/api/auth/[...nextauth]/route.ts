import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    mode: "mock",
    message: "Auth integration is temporarily disabled."
  });
}

export async function POST() {
  return NextResponse.json({
    mode: "mock",
    message: "Auth integration is temporarily disabled."
  });
}
