import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const workspace = await prisma.workspace.upsert({ where: { id: "ws_seed" }, update: {}, create: { id: "ws_seed", name: "Seed Workspace" } });
  const user = await prisma.user.upsert({
    where: { email: "owner@omnigrowth.local" },
    update: {},
    create: { id: "seed_user", email: "owner@omnigrowth.local", name: "Seed Owner", passwordHash: await bcrypt.hash("password123", 10) }
  });

  await prisma.workspaceMember.upsert({
    where: { workspaceId_userId: { workspaceId: workspace.id, userId: user.id } },
    update: { role: Role.OWNER },
    create: { workspaceId: workspace.id, userId: user.id, role: Role.OWNER }
  });

  await prisma.customer.createMany({
    data: [
      { workspaceId: workspace.id, email: "alice@example.com", attributes: { plan: "pro" } },
      { workspaceId: workspace.id, email: "bob@example.com", attributes: { plan: "starter" } }
    ],
    skipDuplicates: true
  });

  await prisma.normalizedEvent.createMany({
    data: [
      { workspaceId: workspace.id, eventName: "session_start", eventAt: new Date(), properties: { utm_source: "google" } },
      { workspaceId: workspace.id, eventName: "signup", eventAt: new Date(), properties: { utm_source: "meta" } },
      { workspaceId: workspace.id, eventName: "purchase", eventAt: new Date(), revenue: 150, properties: { currency: "USD" } }
    ]
  });

  const campaign = await prisma.campaign.create({ data: { workspaceId: workspace.id, platform: "google_ads", name: "Brand Search" } });
  const adset = await prisma.adset.create({ data: { workspaceId: workspace.id, campaignId: campaign.id, name: "US Segment" } });
  await prisma.ad.create({ data: { workspaceId: workspace.id, adsetId: adset.id, name: "Ad A", impressions: 1000, clicks: 80 } });
  await prisma.adSpendDaily.create({ data: { workspaceId: workspace.id, campaignId: campaign.id, spendDate: new Date(), spend: 200 } });

  await prisma.dataset.create({
    data: {
      workspaceId: workspace.id,
      name: "web_searches",
      type: "web_searches",
      schema: [{ key: "query", type: "string" }, { key: "url", type: "string" }],
      rows: [{ query: "best CRM", url: "https://example.com" }]
    }
  });

  await prisma.contact.create({ data: { workspaceId: workspace.id, name: "Jane Lead", email: "jane@corp.com", source: "HubSpot" } });
  await prisma.company.create({ data: { workspaceId: workspace.id, name: "Acme Inc" } });
  await prisma.deal.create({ data: { workspaceId: workspace.id, stage: "Qualified", value: 5000, source: "Dynamics" } });

  console.log("Seed complete");
}

main().finally(async () => prisma.$disconnect());
