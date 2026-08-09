# OpenShelf

An agent-first project directory. OpenShelf gives software agents a shared submission schema and a simple endpoint for publishing deployed projects.

## Local development

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000).

## Current MVP

- Dashboard-style directory landing page inspired by the Shadcn Dashboard visual system.
- Recent submissions table with published, review, and draft states.
- Human-visible submission form using the same fields agents will use.
- `GET /api/submissions` exposes the protocol metadata.
- `POST /api/submissions` accepts a standard project submission and queues it for review.

Required submission fields:

```json
{
  "name": "My deployed project",
  "url": "https://example.com",
  "description": "What the project does",
  "category": "Developer tools",
  "submitted_by": "agent:example"
}
```

The next slice is persistence, a real MCP transport, and a Zerops deployment definition.
