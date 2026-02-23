"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Button } from "@/components/ui/button";

type DataRow = Record<string, string | number>;
type ChartType = "line" | "bar" | "area" | "pie";

export type GraphConfig = {
  id: string;
  name: string;
  chartType: ChartType;
  dimension: string;
  metrics: string[];
};

const PIE_COLORS = ["#0f172a", "#334155", "#64748b", "#94a3b8", "#cbd5e1", "#1e40af", "#0ea5e9"];

function metricKeys(rows: DataRow[]) {
  const first = rows[0] || {};
  return Object.keys(first).filter((k) => typeof first[k] === "number");
}

function dimensionKeys(rows: DataRow[]) {
  const first = rows[0] || {};
  return Object.keys(first).filter((k) => typeof first[k] === "string");
}

function ChartRenderer({ data, config }: { data: DataRow[]; config: GraphConfig }) {
  const chartData = useMemo(
    () =>
      data.map((row) => {
        const next: DataRow = { [config.dimension]: row[config.dimension] as string };
        config.metrics.forEach((m) => (next[m] = row[m] as number));
        return next;
      }),
    [data, config]
  );

  if (config.chartType === "line") {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={config.dimension} />
          <YAxis />
          <Tooltip />
          <Legend />
          {config.metrics.map((m, idx) => (
            <Line key={m} type="monotone" dataKey={m} stroke={PIE_COLORS[idx % PIE_COLORS.length]} strokeWidth={2} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    );
  }

  if (config.chartType === "bar") {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={config.dimension} />
          <YAxis />
          <Tooltip />
          <Legend />
          {config.metrics.map((m, idx) => (
            <Bar key={m} dataKey={m} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (config.chartType === "area") {
    return (
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={config.dimension} />
          <YAxis />
          <Tooltip />
          <Legend />
          {config.metrics.map((m, idx) => (
            <Area key={m} type="monotone" dataKey={m} fill={PIE_COLORS[idx % PIE_COLORS.length]} stroke={PIE_COLORS[idx % PIE_COLORS.length]} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    );
  }

  const firstMetric = config.metrics[0];
  return (
    <ResponsiveContainer width="100%" height={320}>
      <PieChart>
        <Pie data={chartData} dataKey={firstMetric} nameKey={config.dimension} outerRadius={110}>
          {chartData.map((_, idx) => (
            <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function VisualizationStudio({ title, data, presets }: { title: string; data: DataRow[]; presets: GraphConfig[] }) {
  const metrics = useMemo(() => metricKeys(data), [data]);
  const dimensions = useMemo(() => dimensionKeys(data), [data]);
  const [selected, setSelected] = useState<GraphConfig>(presets[0]);
  const [userGraphs, setUserGraphs] = useState<GraphConfig[]>([]);

  const [name, setName] = useState("Custom Graph");
  const [chartType, setChartType] = useState<ChartType>("line");
  const [dimension, setDimension] = useState(dimensions[0] || "");
  const [metric, setMetric] = useState(metrics[0] || "");

  useEffect(() => {
    const saved = localStorage.getItem(`viz_${title}`);
    if (saved) setUserGraphs(JSON.parse(saved) as GraphConfig[]);
  }, [title]);

  useEffect(() => {
    localStorage.setItem(`viz_${title}`, JSON.stringify(userGraphs));
  }, [title, userGraphs]);

  const allGraphs = [...presets, ...userGraphs];

  const addGraph = () => {
    if (!name || !dimension || !metric) return;
    const graph: GraphConfig = {
      id: `graph_${Date.now()}`,
      name,
      chartType,
      dimension,
      metrics: [metric]
    };
    setUserGraphs((prev) => [graph, ...prev]);
    setSelected(graph);
  };

  return (
    <div className="space-y-4 rounded border bg-white p-4">
      <h3 className="text-lg font-semibold">{title} - Visualization Studio</h3>
      <div className="grid gap-2 md:grid-cols-5">
        <select className="rounded border px-2 py-2" value={selected.id} onChange={(e) => setSelected(allGraphs.find((g) => g.id === e.target.value) || allGraphs[0])}>
          {allGraphs.map((g) => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
        <input className="rounded border px-2 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Graph name" />
        <select className="rounded border px-2 py-2" value={chartType} onChange={(e) => setChartType(e.target.value as ChartType)}>
          <option value="line">Line</option>
          <option value="bar">Bar</option>
          <option value="area">Area</option>
          <option value="pie">Pie</option>
        </select>
        <select className="rounded border px-2 py-2" value={dimension} onChange={(e) => setDimension(e.target.value)}>
          {dimensions.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="rounded border px-2 py-2" value={metric} onChange={(e) => setMetric(e.target.value)}>
          {metrics.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <Button className="px-3 py-2" onClick={addGraph}>Add User Graph</Button>
      </div>
      <ChartRenderer data={data} config={selected} />
      <p className="text-xs text-slate-500">Expert mode: switch chart type, metric, and dimension. User graphs persist in browser storage.</p>
    </div>
  );
}
