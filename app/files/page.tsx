import { prisma } from "@/lib/prisma";

const workspaceId = "ws_seed";

export default async function FilesPage() {
  const datasets = await prisma.dataset.findMany({ where: { workspaceId } });
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Files</h2>
      <form action="/api/datasets/upload" method="post" encType="multipart/form-data" className="rounded border bg-white p-4">
        <input type="file" name="file" />
        <button className="ml-2 rounded bg-slate-900 px-3 py-1 text-white">Upload CSV/XLSX</button>
      </form>
      <div className="rounded border bg-white p-4">
        <h3 className="font-medium">Join Builder (MVP)</h3>
        <p>Join uploaded dataset with normalized_events on chosen key (configured in backend endpoint).</p>
      </div>
      <ul>{datasets.map((d) => <li key={d.id}>{d.name} ({d.type})</li>)}</ul>
    </div>
  );
}
