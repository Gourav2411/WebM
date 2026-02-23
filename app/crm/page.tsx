"use client";

import { KpiCards } from "@/components/kpi-cards";
import { VisualizationStudio, type GraphConfig } from "@/components/visualization-studio";
import { crmStages, leadSources } from "@/lib/mock-data";

export default function CrmPage() {
  const pipeline = crmStages.reduce((acc, s) => acc + s.value, 0);

  const crmRows = crmStages.map((s, idx) => ({
    stage: s.stage,
    deals: s.count,
    pipelineValue: s.value,
    leadSource: leadSources[idx % leadSources.length].source,
    sourceVolume: leadSources[idx % leadSources.length].count
  }));

  const presets: GraphConfig[] = [
    { id: "crm1", name: "Pipeline by Stage", chartType: "bar", dimension: "stage", metrics: ["pipelineValue"] },
    { id: "crm2", name: "Deals by Stage", chartType: "line", dimension: "stage", metrics: ["deals"] },
    { id: "crm3", name: "Source Volume", chartType: "area", dimension: "leadSource", metrics: ["sourceVolume"] }
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">CRM</h2>
      <KpiCards items={[{ label: "Pipeline Value", value: pipeline }, { label: "Stages", value: crmStages.length }, { label: "Lead Sources", value: leadSources.length }]} />

      <VisualizationStudio title="CRM Expert" data={crmRows} presets={presets} />

      <div className="rounded border bg-white p-4">
        <h3 className="font-medium">Deals by stage (Mock)</h3>
        <ul className="list-disc pl-6">{crmStages.map((s) => <li key={s.stage}>{s.stage}: {s.count}</li>)}</ul>
      </div>
    </div>
  );
}
