"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ChatDrawer() {
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  const send = async () => {
    const res = await fetch("/api/agent/chat", { method: "POST", body: JSON.stringify({ message }) });
    const data = await res.json();
    setLogs((prev) => [...prev, `You: ${message}`, `Agent: ${data.reply}`]);
    setMessage("");
  };

  return (
    <div className={`border-l bg-white transition-all ${open ? "w-96" : "w-12"}`}>
      <Button variant="outline" className="m-2 px-2" onClick={() => setOpen((v) => !v)}>{open ? "→" : "←"}</Button>
      {open && (
        <div className="p-3">
          <h2 className="font-semibold">AI Agent</h2>
          <div className="my-2 h-64 overflow-auto rounded border p-2 text-sm">
            {logs.map((line, idx) => <p key={idx}>{line}</p>)}
          </div>
          <textarea className="w-full rounded border p-2" value={message} onChange={(e) => setMessage(e.target.value)} />
          <Button className="mt-2 px-3 py-2" onClick={send}>Send</Button>
        </div>
      )}
    </div>
  );
}
