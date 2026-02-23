import { prisma } from "@/lib/prisma";
import type { Connector } from "@/lib/connectors/types";

async function insertMockEvents(workspaceId: string, source: string) {
  const now = new Date();
  await prisma.rawEvent.createMany({
    data: [{ workspaceId, source, eventAt: now, payload: { event: "session_start" } }]
  });
  await prisma.normalizedEvent.createMany({
    data: [
      { workspaceId, eventName: "session_start", eventAt: now, properties: { source } },
      { workspaceId, eventName: "signup", eventAt: now, properties: { source } },
      { workspaceId, eventName: "purchase", eventAt: now, revenue: 120, properties: { source } }
    ]
  });
  return { inserted: 3, source };
}

export const ga4Connector: Connector = { name: "ga4", sync: (workspaceId) => insertMockEvents(workspaceId, "ga4") };
export const amplitudeConnector: Connector = { name: "amplitude", sync: (workspaceId) => insertMockEvents(workspaceId, "amplitude") };
