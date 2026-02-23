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

## Environment variables
See `.env.example`.
- `DATABASE_URL`: Postgres connection
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
