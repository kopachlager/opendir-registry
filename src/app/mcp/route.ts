import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createOpenDirMcpServer } from "@/lib/mcp-server";
import { getPublicOrigin } from "@/lib/request-origin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function originAllowed(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const requestOrigin = getPublicOrigin(request);
  const configuredOrigin = process.env.PUBLIC_APP_URL;
  return origin === requestOrigin || origin === configuredOrigin;
}

async function handleMcpRequest(request: Request) {
  if (!originAllowed(request)) {
    return Response.json(
      { error: "Origin is not allowed." },
      { status: 403 },
    );
  }

  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  const server = createOpenDirMcpServer();
  await server.connect(transport);
  const response = await transport.handleRequest(request);
  const origin = request.headers.get("origin");
  if (origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
    response.headers.set("Access-Control-Expose-Headers", "Mcp-Protocol-Version, Mcp-Session-Id");
    response.headers.set("Vary", "Origin");
  }
  return response;
}

export const GET = handleMcpRequest;
export const POST = handleMcpRequest;
export const DELETE = handleMcpRequest;

export function OPTIONS(request: Request) {
  const origin = request.headers.get("origin") ?? getPublicOrigin(request);
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Mcp-Protocol-Version, Mcp-Session-Id, Mcp-Method, Mcp-Name, Last-Event-ID",
      "Access-Control-Expose-Headers": "Mcp-Protocol-Version, Mcp-Session-Id",
      Vary: "Origin",
    },
  });
}
