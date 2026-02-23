import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { prisma } from "@/lib/prisma";

const workspaceId = "ws_seed";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const workbook = XLSX.read(buffer);
  const first = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(first, { defval: null });
  const schema = Object.keys(rows[0] || {}).map((k) => ({ key: k, type: typeof (rows[0] as Record<string, unknown>)?.[k] }));

  const dataset = await prisma.dataset.create({
    data: { workspaceId, name: file.name, type: "upload", schema: schema as never, rows: rows as never }
  });

  return NextResponse.json({ ok: true, datasetId: dataset.id, rowCount: rows.length });
}
