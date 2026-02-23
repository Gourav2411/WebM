import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  return NextResponse.json({
    ok: true,
    datasetId: `mock_${Date.now()}`,
    rowCount: 5000,
    mode: "mock",
    message: `Accepted ${file.name}. Parsing/storage is mocked for now.`
  });
}
