"use client";

import { KpiCards } from "@/components/kpi-cards";
import { VisualizationStudio, type GraphConfig } from "@/components/visualization-studio";
import { analyticsEvents, kpiSeries } from "@/lib/mock-data";

const analyticsRows = kpiSeries.map((p, i) => ({
  date: p.date,
  sessions: p.value,
  users: Math.round(p.value * 0.62),
  conversions: Math.round(p.value * 0.09),
  revenue: Math.round(p.value * 1.7),
  channel: ["organic", "paid", "email", "social"][i % 4]
}));

const presets: GraphConfig[] = [
  { id: "a1", name: "Sessions Trend", chartType: "line", dimension: "date", metrics: ["sessions", "users"] },
  { id: "a2", name: "Conversion Momentum", chartType: "area", dimension: "date", metrics: ["conversions"] },
  { id: "a3", name: "Revenue Pulse", chartType: "bar", dimension: "date", metrics: ["revenue"] }
];

export default function AnalyticsPage() {
  const sessions = analyticsEvents.find((e) => e.eventName === "session_start")?.count ?? 0;
  const users = 4200;
  const conversions = analyticsEvents.find((e) => e.eventName === "purchase")?.count ?? 0;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Analytics</h2>
      <KpiCards items={[{ label: "Sessions", value: sessions }, { label: "Users", value: users }, { label: "Conversions", value: conversions }]} />

      <VisualizationStudio title="Analytics Expert" data={analyticsRows} presets={presets} />

      <div className="rounded border bg-white p-4">
        <h3 className="font-medium">Funnel Builder (Mock)</h3>
        <ul className="list-disc pl-6">
          {analyticsEvents.map((event) => (
            <li key={event.eventName}>{event.eventName}: {event.count}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
