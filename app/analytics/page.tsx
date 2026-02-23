import { prisma } from "@/lib/prisma";
import { KpiCards } from "@/components/kpi-cards";

const workspaceId = "ws_seed";

type FunnelEventRow = {
  eventName: string;
  count: number;
};

export default async function AnalyticsPage() {
  const [sessions, users, conversions, eventGroups] = await Promise.all([
    prisma.normalizedEvent.count({ where: { workspaceId, eventName: "session_start" } }),
    prisma.customer.count({ where: { workspaceId } }),
    prisma.normalizedEvent.count({ where: { workspaceId, eventName: "purchase" } }),
    prisma.normalizedEvent.groupBy({
      by: ["eventName"],
      _count: { _all: true },
      where: { workspaceId }
    })
  ]);

  const events: FunnelEventRow[] = eventGroups.map((row) => ({
    eventName: row.eventName,
    count: row._count._all
  }));

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Analytics</h2>
      <KpiCards items={[{ label: "Sessions", value: sessions }, { label: "Users", value: users }, { label: "Conversions", value: conversions }]} />
      <div className="rounded border bg-white p-4">
        <h3 className="font-medium">Funnel Builder (MVP)</h3>
        <ul className="list-disc pl-6">
          {events.map((event) => (
            <li key={event.eventName}>
              {event.eventName}: {event.count}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
