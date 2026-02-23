"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type Source = { id: string; source: string; rows: Array<Record<string, string | number>> };
type Merged = { id: string; name: string; leftSource: string; rightSource: string; joinKey: string; rowCount: number; createdAt: string };

type Analysis = { summary: string; insights: string[]; suggestedActions: string[] } | null;

export default function DataManagementPage() {
  const [workspaceId, setWorkspaceId] = useState("ws_seed");
  const [sources, setSources] = useState<Source[]>([]);
  const [merged, setMerged] = useState<Merged[]>([]);
  const [leftSource, setLeftSource] = useState("");
  const [rightSource, setRightSource] = useState("");
  const [joinKey, setJoinKey] = useState("user_id");
  const [name, setName] = useState("Unified Growth Dataset");
  const [analysisPrompt, setAnalysisPrompt] = useState("Find highest ROI cohort and activation actions");
  const [selectedMerged, setSelectedMerged] = useState("");
  const [analysis, setAnalysis] = useState<Analysis>(null);

  const refresh = async (wid: string) => {
    const data = await (await fetch(`/api/data-management/sources?workspaceId=${wid}`)).json();
    setSources(data.sources || []);
    setMerged(data.merged || []);
    if ((data.sources || []).length > 1) {
      setLeftSource((prev) => prev || data.sources[0].source);
      setRightSource((prev) => prev || data.sources[1].source);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("omnigrowth_workspace_id");
    const wid = saved || "ws_seed";
    setWorkspaceId(wid);
    refresh(wid);
  }, []);

  const mergeNow = async () => {
    const res = await fetch(`/api/data-management/merge?workspaceId=${workspaceId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leftSource, rightSource, joinKey, name })
    });
    const data = await res.json();
    if (res.ok) {
      setMerged((prev) => [data.merged, ...prev]);
      setSelectedMerged(data.merged.id);
    }
  };

  const runAnalysis = async () => {
    if (!selectedMerged) return;
    const res = await fetch(`/api/data-management/analyze?workspaceId=${workspaceId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mergedDatasetId: selectedMerged, prompt: analysisPrompt })
    });
    const data = await res.json();
    if (res.ok) setAnalysis(data.analysis);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Data Management</h2>
      <p className="text-slate-600">Merge data across analytics, ads, and CRM sources, transform it, and run AI-assisted analysis.</p>

      <div className="rounded border bg-white p-4">
        <h3 className="mb-2 font-semibold">Available Sources</h3>
        <div className="grid gap-2 md:grid-cols-3">
          {sources.map((s) => (
            <div key={s.id} className="rounded border p-2 text-sm">
              <p><strong>{s.source}</strong></p>
              <p className="text-slate-500">Rows: {s.rows.length}</p>
              <p className="text-slate-500">Columns: {Object.keys(s.rows[0] || {}).join(", ")}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded border bg-white p-4 space-y-2">
        <h3 className="font-semibold">Merge Builder</h3>
        <div className="grid gap-2 md:grid-cols-4">
          <select className="rounded border px-2 py-2" value={leftSource} onChange={(e) => setLeftSource(e.target.value)}>{sources.map((s) => <option key={s.id} value={s.source}>{s.source}</option>)}</select>
          <select className="rounded border px-2 py-2" value={rightSource} onChange={(e) => setRightSource(e.target.value)}>{sources.map((s) => <option key={s.id} value={s.source}>{s.source}</option>)}</select>
          <input className="rounded border px-2 py-2" value={joinKey} onChange={(e) => setJoinKey(e.target.value)} placeholder="Join key" />
          <input className="rounded border px-2 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="Merged dataset name" />
        </div>
        <Button className="px-3 py-2" onClick={mergeNow}>Create Merged Dataset</Button>
      </div>

      <div className="rounded border bg-white p-4 space-y-2">
        <h3 className="font-semibold">Merged Datasets</h3>
        <div className="grid gap-2 md:grid-cols-2">
          {merged.map((m) => (
            <label key={m.id} className="flex items-center gap-2 rounded border p-2 text-sm">
              <input type="radio" name="merged" checked={selectedMerged === m.id} onChange={() => setSelectedMerged(m.id)} />
              <span>
                <strong>{m.name}</strong> ({m.leftSource} ⨝ {m.rightSource} on {m.joinKey}) — {m.rowCount} rows
              </span>
            </label>
          ))}
          {merged.length === 0 && <p className="text-slate-500">No merged datasets yet.</p>}
        </div>
      </div>

      <div className="rounded border bg-white p-4 space-y-2">
        <h3 className="font-semibold">AI Analysis Studio</h3>
        <textarea className="w-full rounded border p-2" rows={3} value={analysisPrompt} onChange={(e) => setAnalysisPrompt(e.target.value)} />
        <Button className="px-3 py-2" onClick={runAnalysis} disabled={!selectedMerged}>Run AI Analysis</Button>
        {analysis && (
          <div className="rounded border bg-slate-50 p-3 text-sm">
            <p className="font-medium">Summary</p>
            <p>{analysis.summary}</p>
            <p className="mt-2 font-medium">Insights</p>
            <ul className="list-disc pl-6">{analysis.insights.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
            <p className="mt-2 font-medium">Suggested Actions</p>
            <ul className="list-disc pl-6">{analysis.suggestedActions.map((a, idx) => <li key={idx}>{a}</li>)}</ul>
          </div>
        )}
      </div>
    </div>
  );
}
