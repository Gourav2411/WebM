import { Queue } from "bullmq";

export const syncQueue = new Queue("connector-sync", {
  connection: { url: process.env.REDIS_URL }
});
