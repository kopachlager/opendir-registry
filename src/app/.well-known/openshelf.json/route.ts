import { NextResponse } from "next/server";
import {
  categories,
  PROTOCOL_NAME,
  PROTOCOL_VERSION,
} from "@/lib/protocol";

export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  return NextResponse.json(
    {
      name: "OpenShelf",
      protocol: PROTOCOL_NAME,
      version: PROTOCOL_VERSION,
      description: "An agent-first directory for deployed software projects.",
      documentation: `${origin}/api/v1/submissions`,
      schema: `${origin}/api/v1/schema`,
      openapi: `${origin}/spec/openapi.yaml`,
      mcp: {
        transport: "streamable-http",
        endpoint: `${origin}/mcp`,
      },
      endpoints: {
        submit: `${origin}/api/v1/submissions`,
        validate: `${origin}/api/v1/validate`,
        projects: `${origin}/api/v1/projects`,
        categories: `${origin}/api/v1/categories`,
      },
      capabilities: [
        "validate_project",
        "submit_project",
        "get_submission_status",
        "search_projects",
      ],
      categories,
      review_policy: "open-with-review",
    },
    { headers: { "Cache-Control": "public, max-age=300" } },
  );
}
