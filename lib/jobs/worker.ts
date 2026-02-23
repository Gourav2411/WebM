import { Worker } from "bullmq";
import { ga4Connector, amplitudeConnector } from "@/lib/connectors/analytics";
import { prisma } from "@/lib/prisma";

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  // eslint-disable-next-line no-console
  console.log("REDIS_URL not set. Worker idle.");
  process.exit(0);
}

const connectors = { ga4: ga4Connector, amplitude: amplitudeConnector } as const;

new Worker(
  "connector-sync",
  async (job) => {
    const { workspaceId, connector } = job.data as { workspaceId: string; connector: keyof typeof connectors };
    const result = await connectors[connector].sync(workspaceId);
    await prisma.syncJob.create({ data: { workspaceId, connector, status: "success", lastRunAt: new Date() } });
    return result;
  },
  { connection: { url: redisUrl } }
);
