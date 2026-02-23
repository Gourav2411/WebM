import { datasetsMock } from "@/lib/mock-data";

export default function FilesPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Files</h2>
      <div className="rounded border bg-white p-4">
        <h3 className="font-medium">Uploads (mock mode)</h3>
        <p>Integrations are temporarily disabled. Dashboards are powered by local mock datasets.</p>
      </div>
      <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {datasetsMock.map((d) => (
          <li key={d.id} className="rounded border bg-white p-3">{d.name} ({d.type}) - {d.rows} rows</li>
        ))}
      </ul>
    </div>
  );
}
