import { KpiCards } from "@/components/kpi-cards";
import { crmStages, leadSources } from "@/lib/mock-data";

export default function CrmPage() {
  const pipeline = crmStages.reduce((acc, s) => acc + s.value, 0);
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">CRM</h2>
      <KpiCards items={[{ label: "Pipeline Value", value: pipeline }, { label: "Stages", value: crmStages.length }, { label: "Lead Sources", value: leadSources.length }]} />
      <div className="rounded border bg-white p-4">
        <h3 className="font-medium">Deals by stage (Mock)</h3>
        <ul className="list-disc pl-6">{crmStages.map((s) => <li key={s.stage}>{s.stage}: {s.count}</li>)}</ul>
      </div>
    </div>
  );
}
