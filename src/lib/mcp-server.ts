import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  categories,
  PROTOCOL_VERSION,
  submissionInputSchema,
  submissionJsonSchema,
  validateSubmission,
} from "@/lib/protocol";
import { serializeSubmission, submitProject } from "@/lib/submission-service";
import { getSubmission, searchProjects } from "@/lib/submissions";

function toolResult(value: unknown, isError = false) {
  return {
    content: [{ type: "text" as const, text: JSON.stringify(value, null, 2) }],
    structuredContent: value as Record<string, unknown>,
    isError,
  };
}

export function createOpenDirMcpServer() {
  const server = new McpServer({
    name: "opendir-registry",
    title: "OpenDir Registry",
    version: PROTOCOL_VERSION,
  });

  server.registerTool(
    "validate_project",
    {
      title: "Validate project submission",
      description:
        "Validate project metadata against ODSS v0.1 without publishing it.",
      inputSchema: submissionInputSchema,
      annotations: { readOnlyHint: true, idempotentHint: true },
    },
    async (input) => toolResult(validateSubmission(input)),
  );

  server.registerTool(
    "submit_project",
    {
      title: "Submit project",
      description:
        "Submit a deployed software project to OpenDir Registry for validation and human review.",
      inputSchema: submissionInputSchema,
      annotations: { readOnlyHint: false, idempotentHint: false },
    },
    async (input) => {
      const result = await submitProject(input);
      return toolResult(result.body, !result.ok);
    },
  );

  server.registerTool(
    "get_submission_status",
    {
      title: "Get submission status",
      description: "Read the current validation and review state of a submission.",
      inputSchema: { submission_id: z.string().min(5) },
      annotations: { readOnlyHint: true, idempotentHint: true },
    },
    async ({ submission_id }) => {
      const submission = await getSubmission(submission_id);
      if (!submission) {
        return toolResult(
          { error: "Submission not found.", code: "NOT_FOUND" },
          true,
        );
      }
      return toolResult({ submission: serializeSubmission(submission) });
    },
  );

  server.registerTool(
    "search_projects",
    {
      title: "Search projects",
      description:
        "Search published OpenDir projects by text, category, and page.",
      inputSchema: {
        query: z.string().max(100).optional(),
        category: z.enum(categories).optional(),
        page: z.number().int().min(1).default(1),
        page_size: z.number().int().min(1).max(50).default(10),
      },
      annotations: { readOnlyHint: true, idempotentHint: true },
    },
    async ({ query, category, page, page_size }) =>
      toolResult(
        await searchProjects({ query, category, page, pageSize: page_size }),
      ),
  );

  server.registerResource(
    "opendir-submission-standard",
    "opendir://spec/v0.1",
    {
      title: "OpenDir Submission Standard (ODSS) v0.1",
      description: "The canonical JSON Schema for project submissions.",
      mimeType: "application/schema+json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/schema+json",
          text: JSON.stringify(submissionJsonSchema, null, 2),
        },
      ],
    }),
  );

  server.registerResource(
    "opendir-categories",
    "opendir://categories",
    {
      title: "OpenDir Categories",
      description: "Accepted categories for project submissions.",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify({ categories }, null, 2),
        },
      ],
    }),
  );

  return server;
}
