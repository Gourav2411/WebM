import { prisma } from "@/lib/prisma";

export async function logAudit(workspaceId: string, action: string, userId?: string, metadata?: unknown) {
  await prisma.auditLog.create({
    data: { workspaceId, action, userId, metadata: metadata as never }
  });
}
