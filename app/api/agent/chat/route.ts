import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { AGENT_SYSTEM_PROMPT } from "@/lib/agent/systemPrompt";
import { createCampaignDraft, getSchema, listCampaignDrafts, requestApproval, runSqlMock } from "@/lib/agent/tools";

const workspaceId = "ws_seed";
const userId = "seed_user";

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const fallback = `MVP mock reply: ${message}`;

  let reply = fallback;
  if (process.env.OPENAI_API_KEY) {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: AGENT_SYSTEM_PROMPT },
        { role: "user", content: message }
      ]
    });
    reply = completion.choices[0]?.message?.content || fallback;
  }

  if (message.includes("schema")) reply += `\nSchema: ${(await getSchema()).join(", ")}`;
  if (message.includes("list drafts")) reply += `\nDrafts: ${JSON.stringify(await listCampaignDrafts(workspaceId))}`;
  if (message.includes("create draft")) {
    const draft = await createCampaignDraft(workspaceId, userId, "google_ads", { name: "Agent Draft" });
    reply += `\nCreated draft ${draft.id}`;
  }
  if (message.includes("request approval")) {
    const first = await prisma.campaignDraft.findFirst({ where: { workspaceId } });
    if (first) await requestApproval(workspaceId, first.id, userId);
  }
  if (message.includes("sql")) {
    const result = await runSqlMock("select * from NormalizedEvent", workspaceId);
    reply += `\nSQL rows: ${result.rows.length}`;
  }

  await prisma.agentConversation.upsert({
    where: { id: workspaceId },
    update: { messages: { push: { role: "user", content: message } as never } },
    create: { id: workspaceId, workspaceId, messages: [{ role: "user", content: message }, { role: "assistant", content: reply }] as never }
  });

  return NextResponse.json({ reply });
}
