import { prisma } from "@/lib/prisma";
import { KpiCards } from "@/components/kpi-cards";

const workspaceId = "ws_seed";

export default async function AnalyticsPage() {
  const [sessions, users, conversions, events] = await Promise.all([
    prisma.normalizedEvent.count({ where: { workspaceId, eventName: "session_start" } }),
    prisma.customer.count({ where: { workspaceId } }),
    prisma.normalizedEvent.count({ where: { workspaceId, eventName: "purchase" } }),
    prisma.normalizedEvent.groupBy({ by: ["eventName"], _count: true, where: { workspaceId } })
  ]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Analytics</h2>
      <KpiCards items={[{ label: "Sessions", value: sessions }, { label: "Users", value: users }, { label: "Conversions", value: conversions }]} />
      <div className="rounded border bg-white p-4">
        <h3 className="font-medium">Funnel Builder (MVP)</h3>
        <ul className="list-disc pl-6">
          {events.map((e) => <li key={e.eventName}>{e.eventName}: {e._count}</li>)}
        </ul>
      </div>
    </div>
  );
}
