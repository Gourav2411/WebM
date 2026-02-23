"use client";

import { KpiCards } from "@/components/kpi-cards";
import { VisualizationStudio, type GraphConfig } from "@/components/visualization-studio";
import { adHierarchy } from "@/lib/mock-data";

export default function AdsPage() {
  const allAds = adHierarchy.flatMap((c) => c.adsets.flatMap((a) => a.ads));
  const spend = allAds.reduce((acc, ad) => acc + ad.spend, 0);
  const clicks = allAds.reduce((acc, ad) => acc + ad.clicks, 0);

  const adsRows = allAds.slice(0, 120).map((ad, idx) => ({
    ad: ad.ad,
    channel: ["search", "social", "display"][idx % 3],
    spend: Math.round(ad.spend),
    clicks: ad.clicks,
    impressions: ad.impressions,
    ctr: Number(((ad.clicks / Math.max(ad.impressions, 1)) * 100).toFixed(2))
  }));

  const presets: GraphConfig[] = [
    { id: "ad1", name: "Spend by Ad", chartType: "bar", dimension: "ad", metrics: ["spend"] },
    { id: "ad2", name: "Clicks vs Impressions", chartType: "line", dimension: "ad", metrics: ["clicks", "impressions"] },
    { id: "ad3", name: "CTR Profile", chartType: "area", dimension: "ad", metrics: ["ctr"] }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Ads</h2>
      <KpiCards items={[{ label: "Spend", value: spend.toFixed(2) }, { label: "CAC Proxy", value: (spend / Math.max(clicks, 1)).toFixed(2) }, { label: "ROAS Proxy", value: 2.8 }]} />

      <VisualizationStudio title="Ads Expert" data={adsRows} presets={presets} />

      <div className="rounded border bg-white p-4">
        <h3 className="font-medium">Campaign drilldown (Mock)</h3>
        <p>Total campaigns: {adHierarchy.length}, ads: {allAds.length}</p>
      </div>
    </div>
  );
}
