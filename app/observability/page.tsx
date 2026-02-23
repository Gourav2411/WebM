import { syncJobsMock } from "@/lib/mock-data";

export default function ObservabilityPage() {
  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Observability</h2>
      <table className="w-full rounded border bg-white text-left">
        <thead><tr><th>Connector</th><th>Status</th><th>Last run</th><th>Error</th></tr></thead>
        <tbody>
          {syncJobsMock.map((j) => (
            <tr key={j.id}><td>{j.connector}</td><td>{j.status}</td><td>{j.lastRunAt}</td><td>{j.error ?? "-"}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
