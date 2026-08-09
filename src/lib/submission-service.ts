import {
  createSubmission,
  DuplicateSubmissionError,
  type SubmissionRecord,
} from "@/lib/submissions";
import { validateSubmission } from "@/lib/protocol";

export type SubmissionServiceResult =
  | {
      ok: true;
      status: 201;
      body: ReturnType<typeof serializeSubmissionResponse>;
    }
  | {
      ok: false;
      status: 400 | 409;
      body: {
        error: string;
        code: string;
        details?: unknown;
      };
    };

export function serializeSubmission(record: SubmissionRecord) {
  return {
    id: record.id,
    name: record.name,
    url: record.url,
    description: record.description,
    category: record.category,
    tags: record.tags,
    repository_url: record.repositoryUrl,
    submitted_by: record.submittedBy,
    status: record.status,
    validation_errors: record.validationErrors,
    created_at: record.createdAt,
    updated_at: record.updatedAt,
  };
}

function serializeSubmissionResponse(
  record: SubmissionRecord,
  storage: "postgres" | "memory",
) {
  return {
    accepted: true,
    submission_id: record.id,
    status: record.status,
    status_url: `/api/v1/submissions/${record.id}`,
    storage,
    submission: serializeSubmission(record),
  };
}

export async function submitProject(input: unknown): Promise<SubmissionServiceResult> {
  const validation = validateSubmission(input);
  if (!validation.valid) {
    return {
      ok: false,
      status: 400,
      body: {
        error: "Submission validation failed.",
        code: "VALIDATION_ERROR",
        details: validation.errors,
      },
    };
  }

  try {
    const { record, storage } = await createSubmission(validation.data);
    return {
      ok: true,
      status: 201,
      body: serializeSubmissionResponse(record, storage),
    };
  } catch (error) {
    if (error instanceof DuplicateSubmissionError) {
      return {
        ok: false,
        status: 409,
        body: {
          error: error.message,
          code: "DUPLICATE_URL",
        },
      };
    }
    throw error;
  }
}
