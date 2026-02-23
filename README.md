# OmniGrowth MVP

OmniGrowth is a multi-tenant SaaS MVP built with **Next.js App Router + TypeScript + Prisma + Postgres + Redis/BullMQ**.

## Features implemented
- Auth.js (NextAuth) with Google + Credentials fallback.
- Workspace/membership model with RBAC roles (Owner/Admin/Analyst/Operator).
- Tabs: Analytics, Ads, Files, CRM, CDP, Observability.
- Connector framework + mock GA4/Amplitude ingestion jobs.
- Ads + CRM connector-ready schemas with mock seeded data.
- CSV/XLSX upload endpoint with schema inference.
- CDP identity map/customer schema + unified profile primitives.
- AI chat drawer with `/api/agent/chat` and tool-like backend actions.
- Campaign draft approval/execution workflow + audit logging.
- Token encryption helper for OAuth token storage.

## Repository tree

```text
.
├── app
│   ├── analytics/page.tsx
│   ├── ads/page.tsx
│   ├── api
│   │   ├── agent/chat/route.ts
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── campaign-drafts/[id]/approve/route.ts
│   │   ├── campaign-drafts/[id]/execute/route.ts
│   │   ├── campaign-drafts/route.ts
│   │   ├── connectors/sync/route.ts
│   │   └── datasets/upload/route.ts
│   ├── cdp/page.tsx
│   ├── crm/page.tsx
│   ├── files/page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   ├── observability/page.tsx
│   └── page.tsx
├── components
│   ├── app-shell.tsx
│   ├── chat-drawer.tsx
│   └── kpi-cards.tsx
├── lib
│   ├── agent
│   │   ├── systemPrompt.ts
│   │   └── tools.ts
│   ├── audit.ts
│   ├── auth.ts
│   ├── connectors
│   │   ├── analytics.ts
│   │   └── types.ts
│   ├── crypto.ts
│   ├── jobs
│   │   ├── queue.ts
│   │   └── worker.ts
│   ├── prisma.ts
│   └── tenant.ts
├── prisma
│   ├── migrations/20261010120000_init/migration.sql
│   ├── schema.prisma
│   └── seed.ts
├── tests/crypto.test.ts
├── .env.example
├── docker-compose.yml
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
└── vitest.config.ts
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy env vars:
```bash
cp .env.example .env
```

3. Start infra (Postgres + Redis):
```bash
docker compose up -d
```

4. Generate Prisma client and migrate:
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Seed mock data:
```bash
npm run prisma:seed
```

6. Run app:
```bash
npm run dev
```

7. (Optional) Run worker for async sync jobs:
```bash
npm run worker
```


## Mock mode (current default)

- External integrations are temporarily disabled. API endpoints for auth/agent/connectors/drafts/uploads return mock responses.
- Dashboard pages use large in-repo mock datasets so the app can render without database access.
- For Vercel preview/build validation, this avoids runtime failures when `DATABASE_URL` is not configured yet.
- Auth and connector endpoints run in mock mode until real integrations are re-enabled.

## Vercel deployment notes

- `vercel.json` pins `framework: "nextjs"` and `outputDirectory: ".next"` to avoid static-output misdetection (e.g. expecting `public`).
- Set `DATABASE_URL` to a production Postgres instance (e.g. Vercel Postgres/Neon/Supabase).
- Set `REDIS_URL` only if you want queued sync jobs; if omitted, connector sync runs inline (serverless-safe fallback).
- Set `DEFAULT_WORKSPACE_ID` for initial/demo workspace resolution when no workspace header is provided.
- Ensure `NEXTAUTH_URL` matches your Vercel production domain and set `NEXTAUTH_SECRET`.
- Prisma client generation is handled via `postinstall` script (`prisma generate`).



## Advanced Visualization Studio

- Added an expert-level visualization studio on Analytics, Ads, and CRM tabs.
- Supports dynamic chart type changes (`line`, `bar`, `area`, `pie`), dimension/metric switching, and preset expert dashboards.
- Users can create their own graphs with custom metric+dimension combinations.
- User-created graphs are persisted in browser localStorage per module.

## Settings page (dynamic platform connectors)

- Added a new `/settings` page to configure platform connections dynamically per platform requirements.
- Analytics platforms included: GA4, Amplitude, Mixpanel, Segment, PostHog.
- Ad platforms included: Google Ads, Meta Ads, LinkedIn Ads, TikTok Ads, Pinterest Ads.
- Each platform renders required input fields dynamically from a platform schema.
- Connections are stored via mock endpoint `/api/settings/connections` in current MVP mode.
- Workspaces can now be created/selected in Settings, and all platform connections are scoped per workspace.
- Added CRM/CDP connector categories to make the app act as a unified analytics + CDP + marketing activation control plane in mock mode.

## Environment variables
See `.env.example`.
- `DATABASE_URL`: Postgres connection (optional while running in mock-only mode)
- `REDIS_URL`: Redis connection for BullMQ
- `NEXTAUTH_SECRET`, OAuth keys
- `ENCRYPTION_KEY`: key for encrypting connector tokens at rest
- `OPENAI_API_KEY`: enables live LLM responses in agent endpoint

## Running tests
```bash
npm test
```

## Notes
- Tenant enforcement is encoded via workspace-scoped query patterns and membership checks helper.
- Agent SQL is sandboxed to read-only allowlisted tables with max row behavior.
- Campaign execution is mocked and guarded by role checks.
