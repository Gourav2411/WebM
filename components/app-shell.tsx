"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChatDrawer } from "@/components/chat-drawer";

const tabs = [
  ["/analytics", "Analytics"],
  ["/ads", "Ads"],
  ["/files", "Files"],
  ["/crm", "CRM"],
  ["/cdp", "CDP"],
  ["/observability", "Observability"],
  ["/settings", "Settings"],
  ["/data-management", "Data Management"]
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="flex min-h-screen">
      <aside className="w-60 border-r bg-white p-4">
        <h1 className="mb-4 text-xl font-bold">OmniGrowth</h1>
        <nav className="space-y-1">
          {tabs.map(([href, label]) => (
            <Link key={href} href={href} className={`block rounded px-3 py-2 ${pathname.startsWith(href) ? "bg-slate-100" : ""}`}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-6">{children}</main>
      <ChatDrawer />
    </div>
  );
}
