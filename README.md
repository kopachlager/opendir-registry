# OpenShelf

OpenShelf is an agent-first directory for deployed software projects. It defines one portable submission contract that can be used through a human form, a REST API, or a remote MCP server.

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
       PostgreSQL on Zerops
              │
              ▼
   Review queue and directory
```

The key MCP workflow is:

1. An agent connects to `/mcp`.
2. It discovers `validate_project` and `submit_project`.
3. The project is validated against OpenShelf Submission Spec v0.1.
4. The accepted submission receives a stable ID and review status.
5. It appears in the web directory and can be queried through REST or MCP.

## OpenShelf Submission Spec v0.1

The canonical schema is in [`spec/openshelf-submission.schema.json`](spec/openshelf-submission.schema.json). OpenAPI documentation is in [`spec/openapi.yaml`](spec/openapi.yaml).

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
GET /.well-known/openshelf.json
```

## MCP server

OpenShelf exposes a stateless Streamable HTTP server at:

```text
POST /mcp
```

Tools:

- `validate_project`
- `submit_project`
- `get_submission_status`
- `search_projects`

Resources:

- `openshelf://spec/v0.1`
- `openshelf://categories`

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

Example submission:

```bash
curl -X POST http://127.0.0.1:3000/api/v1/submissions \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "Example agent project",
    "url": "https://example.com/project",
    "description": "A deployed project submitted through the OpenShelf API.",
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

## Deploying on Zerops

The repository contains two Zerops files:

- [`zerops-import.yaml`](zerops-import.yaml) provisions the Node.js application and PostgreSQL 18 service.
- [`zerops.yaml`](zerops.yaml) builds the standalone Next.js application, runs migrations, starts the service, and configures its health check.

Import `zerops-import.yaml` in Zerops or use zCLI. The app receives `DATABASE_URL` from the managed `db` service automatically.

After deployment, replace the example domain in `server.json` with the assigned Zerops subdomain or custom domain.

## Technology

- Next.js 16 and React 19
- OpenShelf JSON Schema and OpenAPI 3.1
- Model Context Protocol TypeScript SDK
- PostgreSQL using `postgres.js`
- Zerops Node.js runtime and managed PostgreSQL
- Tailwind CSS and shadcn-style primitives

## Current review model

Valid submissions enter the `review` state and are visible with that status. The next moderation slice adds protected publish/reject actions and event history. Raw IP addresses are not collected.
