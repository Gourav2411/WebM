import { prisma } from "@/lib/prisma";

const workspaceId = "ws_seed";

export default async function CdpPage() {
  const customers = await prisma.customer.findMany({ where: { workspaceId }, take: 20 });
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">CDP</h2>
      <p className="rounded border bg-white p-4">Identity rules map event/CRM email into a shared customer_id via identity_map.</p>
      <div className="rounded border bg-white p-4">
        <h3 className="font-medium">Audience Builder (MVP)</h3>
        <p>Filter customers by event/property and export CSV via API endpoint extension.</p>
      </div>
      <ul>{customers.map((c) => <li key={c.id}>{c.email ?? "no email"}</li>)}</ul>
    </div>
  );
}
