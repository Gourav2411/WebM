import { KpiCards } from "@/components/kpi-cards";
import { adHierarchy } from "@/lib/mock-data";

export default function AdsPage() {
  const allAds = adHierarchy.flatMap((c) => c.adsets.flatMap((a) => a.ads));
  const spend = allAds.reduce((acc, ad) => acc + ad.spend, 0);
  const clicks = allAds.reduce((acc, ad) => acc + ad.clicks, 0);
  const roas = 2.8;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Ads</h2>
      <KpiCards items={[{ label: "Spend", value: spend.toFixed(2) }, { label: "CAC Proxy", value: (spend / Math.max(clicks, 1)).toFixed(2) }, { label: "ROAS Proxy", value: roas }]} />
      <div className="rounded border bg-white p-4">
        <h3 className="font-medium">Campaign drilldown (Mock)</h3>
        <p>Total campaigns: {adHierarchy.length}, ads: {allAds.length}</p>
      </div>
    </div>
  );
}
