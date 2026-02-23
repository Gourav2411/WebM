import { prisma } from "@/lib/prisma";

const workspaceId = "ws_seed";

export default async function ObservabilityPage() {
  const jobs = await prisma.syncJob.findMany({ where: { workspaceId }, orderBy: { lastRunAt: "desc" }, take: 20 });
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Observability</h2>
      <table className="w-full rounded border bg-white text-left">
        <thead><tr><th>Connector</th><th>Status</th><th>Last run</th><th>Error</th></tr></thead>
        <tbody>
          {jobs.map((j) => <tr key={j.id}><td>{j.connector}</td><td>{j.status}</td><td>{j.lastRunAt.toISOString()}</td><td>{j.error ?? "-"}</td></tr>)}
        </tbody>
      </table>
    </div>
  );
}
