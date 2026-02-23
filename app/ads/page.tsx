import { prisma } from "@/lib/prisma";
import { KpiCards } from "@/components/kpi-cards";

const workspaceId = "ws_seed";

export default async function AdsPage() {
  const spend = await prisma.adSpendDaily.aggregate({ _sum: { spend: true }, where: { workspaceId } });
  const revenue = await prisma.normalizedEvent.aggregate({ _sum: { revenue: true }, where: { workspaceId } });
  const roas = (revenue._sum.revenue || 0) / (spend._sum.spend || 1);
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Ads</h2>
      <KpiCards items={[{ label: "Spend", value: spend._sum.spend || 0 }, { label: "CAC Proxy", value: 42 }, { label: "ROAS Proxy", value: roas.toFixed(2) }]} />
      <p className="rounded border bg-white p-4">Drilldown campaign → adset → ad is available via API model relations in this MVP.</p>
    </div>
  );
}
