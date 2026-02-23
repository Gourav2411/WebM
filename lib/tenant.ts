import { prisma } from "@/lib/prisma";

export async function assertWorkspaceAccess(userId: string, workspaceId: string) {
  const membership = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } }
  });
  if (!membership) throw new Error("Forbidden");
  return membership;
}

export function tenantWhere<T extends Record<string, unknown>>(workspaceId: string, where: T = {} as T): T {
  return { ...where, workspaceId };
}
