import { NextRequest } from "next/server";

export type UserRole = "OWNER" | "ADMIN" | "ANALYST" | "OPERATOR";

export function getWorkspaceId(req: NextRequest): string {
  return (
    req.headers.get("x-workspace-id") ||
    req.nextUrl.searchParams.get("workspaceId") ||
    process.env.DEFAULT_WORKSPACE_ID ||
    "ws_seed"
  );
}

export function getUserContext(req: NextRequest): { userId: string; role: UserRole } {
  const userId = req.headers.get("x-user-id") || "seed_user";
  const roleHeader = (req.headers.get("x-user-role") || "ADMIN") as UserRole;
  const allowed: UserRole[] = ["OWNER", "ADMIN", "ANALYST", "OPERATOR"];
  const role = allowed.includes(roleHeader) ? roleHeader : "ADMIN";
  return { userId, role };
}
