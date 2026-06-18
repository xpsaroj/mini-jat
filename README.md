# mini-jat — Job Application Tracker

A minimal full-stack job application tracker. Record every application you submit, track its status through the pipeline, and keep notes — all in one clean interface.

## Tech Stack

| Layer | Technology |
|---|---|
| **Client** | Next.js 16 (App Router), Tailwind CSS v4, TypeScript |
| **Server** | Express 5, Drizzle ORM, node-postgres, TypeScript |
| **Database** | PostgreSQL 16 |
| **Testing** | Vitest (server unit tests) |
| **Infra** | Docker, docker-compose |

## Project Layout

```
mini-jat/
├── client/               # Next.js 16 app
│   └── src/
│       ├── app/          # App Router pages
│       ├── components/   # UI + feature components
│       ├── hooks/        # Data-fetching hooks
│       ├── lib/          # API client, schemas, utils
│       └── types/        # Shared TypeScript types
├── server/               # Express API
│   └── src/
│       ├── db/           # Drizzle schema + migrations
│       ├── middleware/   # errorHandler, validate
│       ├── modules/
│       │   └── applications/   # routes, controller, service, validator
│       └── types/        # API response types
└── docker-compose.yml
```

## Quick Start (Docker — recommended)

```bash
# Clone and enter
git clone https://github.com/xpsaroj/mini-jat.git
cd mini-jat

# Start all services (Postgres + server + client)
docker compose up --build
```

Open **http://localhost:3000**.

To stop and remove all containers + volumes:
```bash
docker compose down -v
```

## Local Development (without Docker)

**Prerequisites:** Node 20+, PostgreSQL 15+ running locally.

```bash
# 1 — Server
cp server/.env.example server/.env
# Edit server/.env: set DATABASE_URL to your local postgres connection string
cd server
npm install
npm run db:push          # push schema directly (skips migration files)
npm run dev              # starts on http://localhost:4000

# 2 — Client  (new terminal)
cp client/.env.example client/.env.local
cd client
npm install
npm run dev              # starts on http://localhost:3000
```

## Environment Variables

### `server/.env`

| Variable | Default | Description |
|---|---|---|
| `DATABASE_URL` | — | PostgreSQL connection string (required) |
| `PORT` | `4000` | HTTP port |
| `NODE_ENV` | `development` | `development` or `production` |
| `CLIENT_URL` | `http://localhost:3000` | CORS allowed origin |

### `client/.env.local`

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` | Base URL of the Express API |

## API Reference

Base path: `/api`

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/api/applications` | List applications (filterable, paginated) |
| `POST` | `/api/applications` | Create an application |
| `GET` | `/api/applications/:id` | Get a single application |
| `PATCH` | `/api/applications/:id` | Partial update |
| `DELETE` | `/api/applications/:id` | Delete |

### Query Parameters — `GET /api/applications`

| Param | Type | Default | Description |
|---|---|---|---|
| `status` | `Applied \| Interviewing \| Offer \| Rejected` | — | Filter by status |
| `search` | `string` | — | Case-insensitive search on company name or job title |
| `page` | `number` | `1` | Page number |
| `limit` | `number` | `10` | Results per page (max 100) |

### Application fields

| Field | Type | Notes |
|---|---|---|
| `company_name` | `string` | Required |
| `job_title` | `string` | Required |
| `job_type` | `"Internship" \| "Full-time" \| "Part-time"` | Required |
| `status` | `"Applied" \| "Interviewing" \| "Offer" \| "Rejected"` | Required |
| `applied_date` | `string` (YYYY-MM-DD) | Required |
| `notes` | `string` | Optional |

## Development Commands

### Server (`cd server`)

```bash
npm run dev          # ts-node-dev with watch
npm run build        # compile TypeScript → dist/
npm run typecheck    # tsc --noEmit
npm test             # Vitest unit tests

npm run db:generate  # generate a new Drizzle migration
npm run db:migrate   # apply pending migrations
npm run db:push      # push schema directly (dev shortcut)
npm run db:studio    # open Drizzle Studio in browser
```

### Client (`cd client`)

```bash
npm run dev          # Next.js dev server (Turbopack)
npm run build        # production bundle
npm run typecheck    # tsc --noEmit
```