import { KpiCards } from "@/components/kpi-cards";
import { analyticsEvents, kpiSeries } from "@/lib/mock-data";

export default function AnalyticsPage() {
  const sessions = analyticsEvents.find((e) => e.eventName === "session_start")?.count ?? 0;
  const users = 4200;
  const conversions = analyticsEvents.find((e) => e.eventName === "purchase")?.count ?? 0;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Analytics</h2>
      <KpiCards items={[{ label: "Sessions", value: sessions }, { label: "Users", value: users }, { label: "Conversions", value: conversions }]} />
      <div className="rounded border bg-white p-4">
        <h3 className="font-medium">Funnel Builder (Mock)</h3>
        <ul className="list-disc pl-6">
          {analyticsEvents.map((event) => (
            <li key={event.eventName}>{event.eventName}: {event.count}</li>
          ))}
        </ul>
      </div>
      <div className="rounded border bg-white p-4">
        <h3 className="font-medium">90-day trend (Mock)</h3>
        <p className="text-sm text-slate-600">Points loaded: {kpiSeries.length}</p>
      </div>
    </div>
  );
}
