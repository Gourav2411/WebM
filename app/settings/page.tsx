"use client";

import { useEffect, useMemo, useState } from "react";
import {
  adPlatforms,
  analyticsPlatforms,
  cdpPlatforms,
  crmPlatforms,
  type PlatformCategory,
  type PlatformConfig
} from "@/lib/platform-config";
import { Button } from "@/components/ui/button";

type Workspace = { id: string; name: string; industry?: string; website?: string; createdAt: string };
type Connection = { id: string; platformName: string; category: PlatformCategory; values: Record<string, string>; createdAt: string };

const byType: Record<PlatformCategory, PlatformConfig[]> = {
  analytics: analyticsPlatforms,
  ads: adPlatforms,
  crm: crmPlatforms,
  cdp: cdpPlatforms
};

function PlatformForm({ platform, workspaceId, onSaved }: { platform: PlatformConfig; workspaceId: string; onSaved: (connection: Connection) => void }) {
  const initial = useMemo(() => Object.fromEntries(platform.fields.map((f) => [f.key, ""])) as Record<string, string>, [platform]);
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setValues(initial), [initial]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const res = await fetch(`/api/settings/connections?workspaceId=${workspaceId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ platformKey: platform.key, platformName: platform.name, category: platform.category, values })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Failed to connect");
      setSaving(false);
      return;
    }
    onSaved(data.connection as Connection);
    setSaving(false);
    setValues(initial);
  };

  return (
    <form onSubmit={submit} className="space-y-3 rounded border bg-white p-4">
      <div>
        <h4 className="font-semibold">{platform.name}</h4>
        <p className="text-sm text-slate-600">{platform.description}</p>
      </div>
      {platform.fields.map((field) => (
        <label key={field.key} className="block">
          <span className="mb-1 block text-sm font-medium">{field.label}</span>
          <input required={field.required} type={field.type} placeholder={field.placeholder} value={values[field.key] || ""} onChange={(e) => setValues((p) => ({ ...p, [field.key]: e.target.value }))} className="w-full rounded border px-3 py-2" />
        </label>
      ))}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button disabled={saving} className="px-3 py-2">{saving ? "Saving..." : `Connect ${platform.name}`}</Button>
    </form>
  );
}

export default function SettingsPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [workspaceId, setWorkspaceId] = useState("ws_seed");
  const [newWorkspace, setNewWorkspace] = useState({ name: "", industry: "", website: "" });
  const [type, setType] = useState<PlatformCategory>("analytics");
  const [selectedKey, setSelectedKey] = useState(analyticsPlatforms[0].key);
  const [connections, setConnections] = useState<Connection[]>([]);

  const loadWorkspaces = async () => {
    const d = await (await fetch("/api/workspaces")).json();
    setWorkspaces(d.workspaces || []);
  };

  const loadConnections = async (wid: string) => {
    const d = await (await fetch(`/api/settings/connections?workspaceId=${wid}`)).json();
    setConnections((d.connections || []) as Connection[]);
  };

  useEffect(() => {
    const saved = localStorage.getItem("omnigrowth_workspace_id") || "ws_seed";
    setWorkspaceId(saved);
    loadWorkspaces().then(() => loadConnections(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("omnigrowth_workspace_id", workspaceId);
    loadConnections(workspaceId);
  }, [workspaceId]);

  const activeList = byType[type];
  const platform = activeList.find((p) => p.key === selectedKey) || activeList[0];

  useEffect(() => {
    if (!activeList.some((p) => p.key === selectedKey)) setSelectedKey(activeList[0].key);
  }, [activeList, selectedKey]);

  const createWs = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/workspaces", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newWorkspace) });
    const d = await res.json();
    if (!res.ok) return;
    setNewWorkspace({ name: "", industry: "", website: "" });
    await loadWorkspaces();
    setWorkspaceId(d.workspace.id);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Workspace & Integrations</h2>
      <p className="text-slate-600">Create project workspaces and connect analytics, ads, CRM and CDP platforms.</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded border bg-white p-4">
          <h3 className="font-semibold">Select Workspace</h3>
          <select value={workspaceId} onChange={(e) => setWorkspaceId(e.target.value)} className="mt-2 w-full rounded border px-3 py-2">
            {workspaces.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
          </select>
        </div>
        <form onSubmit={createWs} className="rounded border bg-white p-4 space-y-2">
          <h3 className="font-semibold">Create Workspace</h3>
          <input required placeholder="Workspace name" value={newWorkspace.name} onChange={(e) => setNewWorkspace((p) => ({ ...p, name: e.target.value }))} className="w-full rounded border px-3 py-2" />
          <input placeholder="Industry" value={newWorkspace.industry} onChange={(e) => setNewWorkspace((p) => ({ ...p, industry: e.target.value }))} className="w-full rounded border px-3 py-2" />
          <input placeholder="Website" value={newWorkspace.website} onChange={(e) => setNewWorkspace((p) => ({ ...p, website: e.target.value }))} className="w-full rounded border px-3 py-2" />
          <Button className="px-3 py-2">Create Workspace</Button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        {(["analytics", "ads", "crm", "cdp"] as PlatformCategory[]).map((t) => (
          <Button key={t} variant={type === t ? "default" : "outline"} className="px-3 py-2" onClick={() => setType(t)}>{t.toUpperCase()}</Button>
        ))}
      </div>

      <div className="rounded border bg-white p-3">
        <label className="text-sm font-medium">Select platform</label>
        <select value={platform.key} onChange={(e) => setSelectedKey(e.target.value)} className="mt-1 w-full rounded border px-3 py-2">
          {activeList.map((p) => <option key={p.key} value={p.key}>{p.name}</option>)}
        </select>
      </div>

      <PlatformForm platform={platform} workspaceId={workspaceId} onSaved={(conn) => setConnections((prev) => [conn, ...prev])} />

      <div className="rounded border bg-white p-4">
        <h3 className="mb-2 font-semibold">Workspace Connections</h3>
        <div className="grid gap-2 md:grid-cols-2">
          {connections.length === 0 && <p className="text-slate-500">No connections yet.</p>}
          {connections.map((c) => (
            <div key={c.id} className="rounded border p-2 text-sm">
              <p><strong>{c.platformName}</strong> ({c.category})</p>
              <p className="text-slate-500">{new Date(c.createdAt).toLocaleString()}</p>
              <p className="mt-1 text-slate-600">Fields: {Object.keys(c.values).join(", ")}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
