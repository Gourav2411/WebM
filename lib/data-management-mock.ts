export type SourceDataset = {
  id: string;
  workspaceId: string;
  source: string;
  rows: Array<Record<string, string | number>>;
};

export type MergedDataset = {
  id: string;
  workspaceId: string;
  name: string;
  leftSource: string;
  rightSource: string;
  joinKey: string;
  rowCount: number;
  createdAt: string;
};

const sourceStore = new Map<string, SourceDataset[]>();
const mergedStore = new Map<string, MergedDataset[]>();

function seed(workspaceId: string) {
  if (sourceStore.has(workspaceId)) return;
  sourceStore.set(workspaceId, [
    {
      id: "src_analytics",
      workspaceId,
      source: "analytics_events",
      rows: Array.from({ length: 120 }).map((_, i) => ({
        user_id: `u_${(i % 40) + 1}`,
        date: `2026-01-${String((i % 28) + 1).padStart(2, "0")}`,
        sessions: 1 + (i % 4),
        revenue: 10 + (i % 13) * 5
      }))
    },
    {
      id: "src_ads",
      workspaceId,
      source: "ads_performance",
      rows: Array.from({ length: 120 }).map((_, i) => ({
        user_id: `u_${(i % 40) + 1}`,
        date: `2026-01-${String((i % 28) + 1).padStart(2, "0")}`,
        spend: 3 + (i % 9),
        clicks: 5 + (i % 17)
      }))
    },
    {
      id: "src_crm",
      workspaceId,
      source: "crm_contacts",
      rows: Array.from({ length: 80 }).map((_, i) => ({
        user_id: `u_${(i % 40) + 1}`,
        deal_stage: ["new", "qualified", "proposal", "won"][i % 4],
        lead_score: 40 + (i % 45)
      }))
    }
  ]);
}

export function listSources(workspaceId: string) {
  seed(workspaceId);
  return sourceStore.get(workspaceId) || [];
}

export function listMerged(workspaceId: string) {
  return mergedStore.get(workspaceId) || [];
}

export function createMerged(workspaceId: string, leftSource: string, rightSource: string, joinKey: string, name: string) {
  const merged: MergedDataset = {
    id: `merge_${Date.now()}`,
    workspaceId,
    name,
    leftSource,
    rightSource,
    joinKey,
    rowCount: 500 + Math.floor(Math.random() * 500),
    createdAt: new Date().toISOString()
  };
  const prev = mergedStore.get(workspaceId) || [];
  mergedStore.set(workspaceId, [merged, ...prev]);
  return merged;
}

export function analyzeMerged(workspaceId: string, mergedDatasetId: string, prompt: string) {
  const merged = (mergedStore.get(workspaceId) || []).find((m) => m.id === mergedDatasetId);
  if (!merged) return { error: "Merged dataset not found" };

  return {
    summary: `AI analysis for ${merged.name}: strong correlation between spend and revenue in merged rows (${merged.rowCount}).`,
    insights: [
      "Users with higher lead_score exhibit 1.8x conversion probability.",
      "ROAS is strongest in cohorts with >= 2 sessions.",
      "Qualified and proposal stages show highest marginal revenue potential."
    ],
    suggestedActions: [
      "Create retargeting audience for high lead_score users with low sessions.",
      "Shift +12% spend to cohorts with stronger ROAS signals.",
      `Prompt context captured: ${prompt || "(none)"}`
    ]
  };
}
