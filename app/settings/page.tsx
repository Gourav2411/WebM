"use client";

import { useEffect, useMemo, useState } from "react";
import { adPlatforms, analyticsPlatforms, type PlatformConfig } from "@/lib/platform-config";
import { Button } from "@/components/ui/button";

type Connection = {
  id: string;
  platformKey: string;
  platformName: string;
  category: "analytics" | "ads";
  values: Record<string, string>;
  createdAt: string;
};

function PlatformForm({
  platform,
  onSaved
}: {
  platform: PlatformConfig;
  onSaved: (connection: Connection) => void;
}) {
  const initial = useMemo(() => Object.fromEntries(platform.fields.map((f) => [f.key, ""])) as Record<string, string>, [platform]);
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setValues(initial);
  }, [initial]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch("/api/settings/connections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platformKey: platform.key,
        platformName: platform.name,
        category: platform.category,
        values
      })
    });
    const data = await res.json();
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
          <input
            required={field.required}
            type={field.type}
            placeholder={field.placeholder}
            value={values[field.key] || ""}
            onChange={(e) => setValues((prev) => ({ ...prev, [field.key]: e.target.value }))}
            className="w-full rounded border px-3 py-2"
          />
        </label>
      ))}
      <Button disabled={saving} className="px-3 py-2">{saving ? "Saving..." : `Connect ${platform.name}`}</Button>
    </form>
  );
}

export default function SettingsPage() {
  const [type, setType] = useState<"analytics" | "ads">("analytics");
  const [selectedKey, setSelectedKey] = useState(analyticsPlatforms[0].key);
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    fetch("/api/settings/connections")
      .then((r) => r.json())
      .then((d) => setConnections((d.connections || []) as Connection[]));
  }, []);

  const activeList = type === "analytics" ? analyticsPlatforms : adPlatforms;
  const platform = activeList.find((p) => p.key === selectedKey) || activeList[0];

  useEffect(() => {
    if (!activeList.some((p) => p.key === selectedKey)) setSelectedKey(activeList[0].key);
  }, [activeList, selectedKey]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Settings</h2>
      <p className="text-slate-600">Configure workspace-level platform connections with dynamic required fields.</p>

      <div className="flex gap-2">
        <Button variant={type === "analytics" ? "default" : "outline"} className="px-3 py-2" onClick={() => setType("analytics")}>Analytics Platforms</Button>
        <Button variant={type === "ads" ? "default" : "outline"} className="px-3 py-2" onClick={() => setType("ads")}>Ad Platforms</Button>
      </div>

      <div className="rounded border bg-white p-3">
        <label className="text-sm font-medium">Select platform</label>
        <select value={platform.key} onChange={(e) => setSelectedKey(e.target.value)} className="mt-1 w-full rounded border px-3 py-2">
          {activeList.map((p) => (
            <option key={p.key} value={p.key}>{p.name}</option>
          ))}
        </select>
      </div>

      <PlatformForm
        platform={platform}
        onSaved={(conn) => setConnections((prev) => [conn, ...prev])}
      />

      <div className="rounded border bg-white p-4">
        <h3 className="mb-2 font-semibold">Saved Connections (Current Workspace)</h3>
        <div className="space-y-2 text-sm">
          {connections.length === 0 && <p className="text-slate-500">No connections yet.</p>}
          {connections.map((c) => (
            <div key={c.id} className="rounded border p-2">
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
