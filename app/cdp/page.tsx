import { customersMock } from "@/lib/mock-data";

export default function CdpPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">CDP</h2>
      <p className="rounded border bg-white p-4">Identity resolution and audience builder are currently running in mock mode.</p>
      <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {customersMock.slice(0, 60).map((c) => (
          <li key={c.id} className="rounded border bg-white p-3">{c.email} ({c.plan})</li>
        ))}
      </ul>
    </div>
  );
}
