import { NextRequest } from "next/server";
import { Role } from "@prisma/client";

export function getWorkspaceId(req: NextRequest): string {
  return (
    req.headers.get("x-workspace-id") ||
    req.nextUrl.searchParams.get("workspaceId") ||
    process.env.DEFAULT_WORKSPACE_ID ||
    "ws_seed"
  );
}

export function getUserContext(req: NextRequest): { userId: string; role: Role } {
  const userId = req.headers.get("x-user-id") || "seed_user";
  const roleHeader = req.headers.get("x-user-role") || "ADMIN";
  const role = Object.values(Role).includes(roleHeader as Role) ? (roleHeader as Role) : Role.ADMIN;
  return { userId, role };
}
