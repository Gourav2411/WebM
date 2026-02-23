import { Worker } from "bullmq";
import { ga4Connector, amplitudeConnector } from "@/lib/connectors/analytics";
import { prisma } from "@/lib/prisma";

const connectors = { ga4: ga4Connector, amplitude: amplitudeConnector } as const;

new Worker(
  "connector-sync",
  async (job) => {
    const { workspaceId, connector } = job.data as { workspaceId: string; connector: keyof typeof connectors };
    const result = await connectors[connector].sync(workspaceId);
    await prisma.syncJob.create({ data: { workspaceId, connector, status: "success", lastRunAt: new Date() } });
    return result;
  },
  { connection: { url: process.env.REDIS_URL } }
);
