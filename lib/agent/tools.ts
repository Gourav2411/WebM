export type Role = "OWNER" | "ADMIN" | "ANALYST" | "OPERATOR";

type Draft = {
  id: string;
  workspaceId: string;
  platform: string;
  payload: unknown;
  status: "DRAFT" | "PENDING_APPROVAL" | "APPROVED" | "EXECUTED" | "REJECTED";
  createdBy: string;
};

const drafts: Draft[] = [];
const READ_ONLY_ALLOWED = ["NormalizedEvent", "AdSpendDaily", "Campaign", "Deal", "Contact", "Dataset", "Customer"];

export async function getSchema() {
  return READ_ONLY_ALLOWED;
}

export async function runSqlMock(_query: string, _workspaceId: string) {
  const rows = Array.from({ length: 100 }).map((_, i) => ({ id: i + 1, eventName: "session_start" }));
  return { rows, truncated: true };
}

export async function createCampaignDraft(workspaceId: string, userId: string, platform: string, payload: unknown) {
  const draft: Draft = {
    id: `draft_${Date.now()}`,
    workspaceId,
    platform,
    payload,
    status: "DRAFT",
    createdBy: userId
  };
  drafts.push(draft);
  return draft;
}

export async function listCampaignDrafts(workspaceId: string, status?: Draft["status"]) {
  return drafts.filter((d) => d.workspaceId === workspaceId && (!status || d.status === status));
}

export async function requestApproval(workspaceId: string, draftId: string, _userId: string) {
  const draft = drafts.find((d) => d.workspaceId === workspaceId && d.id === draftId);
  if (!draft) throw new Error("Draft not found");
  draft.status = "PENDING_APPROVAL";
  return draft;
}

export async function executeDraft(workspaceId: string, draftId: string, _userId: string, role: Role) {
  if (role === "OPERATOR") throw new Error("Operators cannot execute drafts");
  const draft = drafts.find((d) => d.workspaceId === workspaceId && d.id === draftId);
  if (!draft) throw new Error("Draft not found");
  draft.status = "EXECUTED";
  return { ok: true, draft };
}
