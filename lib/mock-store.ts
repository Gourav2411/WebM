export type Workspace = {
  id: string;
  name: string;
  industry?: string;
  website?: string;
  createdAt: string;
};

export type Connection = {
  id: string;
  workspaceId: string;
  platformKey: string;
  platformName: string;
  category: "analytics" | "ads" | "crm" | "cdp";
  values: Record<string, string>;
  createdAt: string;
};

const workspaceStore = new Map<string, Workspace>();
const connectionStore = new Map<string, Connection[]>();

if (!workspaceStore.has("ws_seed")) {
  workspaceStore.set("ws_seed", {
    id: "ws_seed",
    name: "Demo Workspace",
    industry: "SaaS",
    website: "https://demo.example.com",
    createdAt: new Date().toISOString()
  });
}

export function listWorkspaces() {
  return Array.from(workspaceStore.values());
}

export function createWorkspace(input: Omit<Workspace, "id" | "createdAt">) {
  const workspace: Workspace = {
    id: `ws_${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...input
  };
  workspaceStore.set(workspace.id, workspace);
  if (!connectionStore.has(workspace.id)) connectionStore.set(workspace.id, []);
  return workspace;
}

export function listConnections(workspaceId: string) {
  return connectionStore.get(workspaceId) || [];
}

export function createConnection(input: Omit<Connection, "id" | "createdAt">) {
  const connection: Connection = {
    id: `conn_${Date.now()}`,
    createdAt: new Date().toISOString(),
    ...input
  };
  const prev = connectionStore.get(input.workspaceId) || [];
  connectionStore.set(input.workspaceId, [connection, ...prev]);
  return connection;
}
