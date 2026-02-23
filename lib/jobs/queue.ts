import { Queue } from "bullmq";

let queue: Queue | null = null;

export function getSyncQueue() {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) return null;
  if (!queue) {
    queue = new Queue("connector-sync", {
      connection: { url: redisUrl }
    });
  }
  return queue;
}
