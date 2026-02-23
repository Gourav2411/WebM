export type TimeseriesPoint = { date: string; value: number };

export const kpiSeries: TimeseriesPoint[] = Array.from({ length: 90 }).map((_, i) => ({
  date: new Date(Date.now() - (89 - i) * 86400000).toISOString().slice(0, 10),
  value: 800 + Math.round(Math.sin(i / 6) * 120 + i * 4)
}));

export const analyticsEvents = [
  "session_start",
  "page_view",
  "cta_click",
  "signup",
  "onboarding_complete",
  "purchase"
].map((eventName, idx) => ({
  eventName,
  count: 9000 - idx * 1200
}));

export const adHierarchy = Array.from({ length: 20 }).map((_, c) => ({
  campaign: `Campaign ${c + 1}`,
  adsets: Array.from({ length: 5 }).map((_, a) => ({
    adset: `Adset ${c + 1}-${a + 1}`,
    ads: Array.from({ length: 8 }).map((_, ad) => ({
      ad: `Ad ${c + 1}-${a + 1}-${ad + 1}`,
      impressions: 5000 + c * 300 + a * 100 + ad * 20,
      clicks: 240 + c * 12 + a * 4 + ad,
      spend: 180 + c * 7 + a * 3 + ad * 0.5
    }))
  }))
}));

export const datasetsMock = Array.from({ length: 40 }).map((_, i) => ({
  id: `ds_${i + 1}`,
  name: `dataset_${i + 1}.csv`,
  type: i % 4 === 0 ? "web_searches" : "upload",
  rows: 1500 + i * 37
}));

export const crmStages = [
  { stage: "New", count: 120, value: 180000 },
  { stage: "Qualified", count: 80, value: 220000 },
  { stage: "Proposal", count: 42, value: 170000 },
  { stage: "Negotiation", count: 18, value: 94000 },
  { stage: "Closed Won", count: 14, value: 128000 }
];

export const leadSources = [
  { source: "HubSpot", count: 120 },
  { source: "Dynamics", count: 88 },
  { source: "Organic", count: 71 },
  { source: "Events", count: 34 }
];

export const customersMock = Array.from({ length: 120 }).map((_, i) => ({
  id: `cust_${i + 1}`,
  email: `customer${i + 1}@example.com`,
  plan: i % 3 === 0 ? "enterprise" : i % 2 === 0 ? "pro" : "starter"
}));

export const syncJobsMock = Array.from({ length: 30 }).map((_, i) => ({
  id: `job_${i + 1}`,
  connector: i % 2 === 0 ? "ga4" : "amplitude",
  status: i % 7 === 0 ? "warning" : "success",
  error: i % 7 === 0 ? "Rate limited, retried" : null,
  lastRunAt: new Date(Date.now() - i * 3600000).toISOString()
}));
