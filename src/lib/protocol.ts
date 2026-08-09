import { z } from "zod";

export const PROTOCOL_NAME = "opendir-submission-standard";
export const PROTOCOL_VERSION = "0.1.0";

export const categories = [
  "AI & Agents",
  "Developer Tools",
  "Data",
  "Infrastructure",
  "Productivity",
  "Open Source",
] as const;

const httpsUrl = z
  .url()
  .refine((value) => new URL(value).protocol === "https:", "Must use HTTPS");

const optionalHttpsUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  httpsUrl.optional(),
);

export const submittedBySchema = z.union([
  z.string().trim().min(3).max(120),
  z.object({
    type: z.enum(["agent", "human", "organization"]),
    name: z.string().trim().min(1).max(80),
  }),
]);

export const submissionInputSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    url: httpsUrl,
    description: z.string().trim().min(20).max(1_000),
    category: z.enum(categories),
    tags: z.array(z.string().trim().min(1).max(30)).max(8).default([]),
    repository_url: optionalHttpsUrl,
    submitted_by: submittedBySchema,
  })
  .strict();

export type SubmissionInput = z.infer<typeof submissionInputSchema>;

export type SubmissionStatus =
  | "received"
  | "validating"
  | "review"
  | "published"
  | "rejected";

export function normalizeSubmittedBy(value: SubmissionInput["submitted_by"]) {
  return typeof value === "string" ? value : `${value.type}:${value.name}`;
}

export function validateSubmission(input: unknown) {
  const result = submissionInputSchema.safeParse(input);
  if (result.success) {
    return { valid: true as const, data: result.data, errors: [] };
  }

  return {
    valid: false as const,
    errors: result.error.issues.map((issue) => ({
      field: issue.path.join(".") || "submission",
      message: issue.message,
      code: issue.code,
    })),
  };
}

export const submissionJsonSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://raw.githubusercontent.com/kopachlager/opendir-registry/main/spec/opendir-submission.schema.json",
  title: "OpenDir Project Submission",
  description: "A portable record for submitting a deployed software project.",
  type: "object",
  additionalProperties: false,
  required: ["name", "url", "description", "category", "submitted_by"],
  properties: {
    name: { type: "string", minLength: 2, maxLength: 100 },
    url: { type: "string", format: "uri", pattern: "^https://" },
    description: { type: "string", minLength: 20, maxLength: 1_000 },
    category: { type: "string", enum: categories },
    tags: {
      type: "array",
      maxItems: 8,
      uniqueItems: true,
      items: { type: "string", minLength: 1, maxLength: 30 },
      default: [],
    },
    repository_url: { type: "string", format: "uri", pattern: "^https://" },
    submitted_by: {
      oneOf: [
        { type: "string", minLength: 3, maxLength: 120 },
        {
          type: "object",
          additionalProperties: false,
          required: ["type", "name"],
          properties: {
            type: { enum: ["agent", "human", "organization"] },
            name: { type: "string", minLength: 1, maxLength: 80 },
          },
        },
      ],
    },
  },
} as const;
