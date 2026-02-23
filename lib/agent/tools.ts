import { DraftStatus, Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";

const READ_ONLY_ALLOWED = ["NormalizedEvent", "AdSpendDaily", "Campaign", "Deal", "Contact", "Dataset", "Customer"];

export async function getSchema() {
  return READ_ONLY_ALLOWED;
}

export async function runSqlMock(query: string, workspaceId: string) {
  const q = query.toLowerCase();
  if (q.includes("update") || q.includes("delete") || q.includes("insert")) throw new Error("Read-only only");
  if (!READ_ONLY_ALLOWED.some((t) => q.includes(t.toLowerCase()))) throw new Error("Table not allowlisted");
  const rows = await prisma.normalizedEvent.findMany({ where: { workspaceId }, take: 100 });
  return { rows, truncated: rows.length >= 100 };
}

export async function createCampaignDraft(workspaceId: string, userId: string, platform: string, payload: unknown) {
  const draft = await prisma.campaignDraft.create({
    data: { workspaceId, createdBy: userId, platform, payload: payload as never }
  });
  await logAudit(workspaceId, "agent.create_draft", userId, { draftId: draft.id });
  return draft;
}

export async function listCampaignDrafts(workspaceId: string, status?: DraftStatus) {
  return prisma.campaignDraft.findMany({ where: { workspaceId, status } });
}

export async function requestApproval(workspaceId: string, draftId: string, userId: string) {
  const draft = await prisma.campaignDraft.update({ where: { id: draftId, workspaceId }, data: { status: DraftStatus.PENDING_APPROVAL } });
  await logAudit(workspaceId, "agent.request_approval", userId, { draftId });
  return draft;
}

export async function executeDraft(workspaceId: string, draftId: string, userId: string, role: Role) {
  if (role === Role.OPERATOR) throw new Error("Operators cannot execute drafts");
  const draft = await prisma.campaignDraft.update({ where: { id: draftId, workspaceId }, data: { status: DraftStatus.EXECUTED } });
  await logAudit(workspaceId, "agent.execute_draft", userId, { draftId, mock: true });
  return { ok: true, draft };
}
