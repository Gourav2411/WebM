import { NextRequest, NextResponse } from "next/server";

const mockDrafts = Array.from({ length: 10 }).map((_, i) => ({
  id: `draft_${i + 1}`,
  platform: i % 2 === 0 ? "google_ads" : "meta_ads",
  status: i % 3 === 0 ? "PENDING_APPROVAL" : "DRAFT"
}));

export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status");
  return NextResponse.json(status ? mockDrafts.filter((d) => d.status === status) : mockDrafts);
}
