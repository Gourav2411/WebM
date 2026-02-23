export interface Connector {
  name: string;
  sync(workspaceId: string): Promise<{ inserted: number; source: string }>;
}
