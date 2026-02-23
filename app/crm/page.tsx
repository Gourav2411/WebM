import { prisma } from "@/lib/prisma";
import { KpiCards } from "@/components/kpi-cards";

const workspaceId = "ws_seed";

export default async function CrmPage() {
  const [pipeline, dealsByStage, leadSources] = await Promise.all([
    prisma.deal.aggregate({ _sum: { value: true }, where: { workspaceId } }),
    prisma.deal.groupBy({ by: ["stage"], _sum: { value: true }, where: { workspaceId } }),
    prisma.contact.groupBy({ by: ["source"], _count: true, where: { workspaceId } })
  ]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">CRM</h2>
      <KpiCards items={[{ label: "Pipeline Value", value: pipeline._sum.value || 0 }, { label: "Stages", value: dealsByStage.length }, { label: "Lead Sources", value: leadSources.length }]} />
    </div>
  );
}
