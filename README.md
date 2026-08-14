# OpenDir Registry

OpenDir Registry is an agent-first directory for deployed software projects. It defines the OpenDir Submission Standard (ODSS), one portable contract that can be used through a human form, a REST API, or a remote MCP server.

Current release: OpenDir Registry 0.2.0 using ODSS 0.1.0.

## The workflow

```text
Agent or human
      │
      ├── Web form
      ├── REST API
      └── MCP tools
              │
              ▼
    Shared validation service
              │
              ▼
       PostgreSQL on Railway
              │
              ▼
   Review queue and directory
```

The key MCP workflow is:

1. An agent connects to `/mcp`.
2. It discovers `validate_project` and `submit_project`.
3. The project is validated against ODSS v0.1.
4. The accepted submission receives a stable ID and review status.
5. After approval, it appears in the web directory and can be queried through REST or MCP.

## OpenDir Submission Standard (ODSS) v0.1

The canonical schema is in [`spec/opendir-submission.schema.json`](spec/opendir-submission.schema.json). OpenAPI documentation is in [`spec/openapi.yaml`](spec/openapi.yaml).

```json
{
  "name": "My deployed project",
  "url": "https://example.com",
  "description": "A clear description of what the project does.",
  "category": "Developer Tools",
  "tags": ["mcp", "automation"],
  "repository_url": "https://github.com/example/project",
  "submitted_by": {
    "type": "agent",
    "name": "codex"
  }
}
```

Discovery document:

```text
GET /.well-known/opendir.json
```

## MCP server

OpenDir exposes a stateless Streamable HTTP server at:

```text
POST /mcp
```

Tools:

- `validate_project`
- `submit_project`
- `get_submission_status`
- `search_projects`

Resources:

- `opendir://spec/v0.1`
- `opendir://categories`
- `opendir://submissions/{submission_id}` — integrity and review receipt

Human-readable integration instructions are available at `/agents`; the raw discovery contract remains at `/.well-known/opendir.json`.

Product releases are recorded on the public `/changelog` page.

The registry metadata draft is included in [`server.json`](server.json).

## REST API

```text
GET  /api/v1/schema
GET  /api/v1/categories
POST /api/v1/validate
GET  /api/v1/projects
POST /api/v1/submissions
GET  /api/v1/submissions/:id
GET  /api/health
```

Each accepted submission returns `/submissions/:id` for people and `/api/v1/submissions/:id` for agents.

Example submission:

```bash
curl -X POST http://127.0.0.1:3000/api/v1/submissions \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Example agent project",
    "url": "https://example.com/project",
    "description": "A deployed project submitted through the OpenDir API.",
    "category": "AI & Agents",
    "tags": ["agents"],
    "submitted_by": { "type": "agent", "name": "example" }
  }'
```

## Local development

The app works without PostgreSQL using an in-memory submission store:

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

For persistent local storage, copy `.env.example`, create the database, and run:

```bash
npm run db:migrate
npm run dev
```

## Deploying on Railway

The repository contains a Docker-based Railway deployment configuration:

- [`Dockerfile`](Dockerfile) builds the standalone Next.js application.
- [`railway.json`](railway.json) runs migrations before each release, starts the service, and configures `/api/health` as its health check.

Create an application service from this GitHub repository and attach a managed PostgreSQL service. Configure `DATABASE_URL`, `PUBLIC_APP_URL`, `ADMIN_TOKEN`, and optionally `ADMIN_REVIEWER_NAME` on the application service. Keep `DATABASE_URL` and `ADMIN_TOKEN` in Railway's secret variable store.

The current hosted MCP endpoint is published in [`server.json`](server.json). Runtime links in the well-known discovery manifest derive from `PUBLIC_APP_URL`.

## Technology

- Next.js 16 and React 19
- ODSS JSON Schema and OpenAPI 3.1
- Model Context Protocol TypeScript SDK
- PostgreSQL using `postgres.js`
- Railway container runtime and managed PostgreSQL
- Tailwind CSS and shadcn-style primitives

## License

OpenDir Registry is released under the [MIT License](LICENSE). Prominent dependency and design-reference attributions are listed in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md). Submitted listing content remains subject to its owners' rights and the service terms.

## Review model

Valid submissions enter the private `review` queue. A reviewer signs in at `/admin`, opens the live project and repository, and either approves the project or rejects it with a reason. Approval creates the public project record; both decisions are written to the submission event history. Public search returns only approved projects. The application does not store submitter IP addresses in its database, although hosting and network infrastructure may process ordinary access logs as described in the privacy notice.

Set `ADMIN_TOKEN` on the application service to enable reviewer access. `ADMIN_REVIEWER_NAME` is optional and controls the name written to review events.

The initial release is designed for one trusted owner. Keep the token in the hosting secret store, never commit or share it, and rotate it if it may have been exposed. Individual reviewer accounts, MFA, granular permissions, and login rate limiting are future hardening work before access is delegated to a team.
