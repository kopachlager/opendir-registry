import { randomUUID } from "node:crypto";
import { getDatabase, hasDatabase } from "@/lib/db";
import {
  normalizeSubmittedBy,
  type SubmissionInput,
  type SubmissionStatus,
} from "@/lib/protocol";

export type SubmissionRecord = {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  repositoryUrl?: string;
  submittedBy: string;
  status: SubmissionStatus;
  validationErrors: unknown[];
  reviewedBy?: string;
  reviewReason?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
};

export class DuplicateSubmissionError extends Error {
  constructor() {
    super("This project URL has already been submitted.");
    this.name = "DuplicateSubmissionError";
  }
}

declare global {
  var opendirMemorySubmissions: Map<string, SubmissionRecord> | undefined;
}

function memoryStore() {
  if (!globalThis.opendirMemorySubmissions) {
    globalThis.opendirMemorySubmissions = new Map();
  }
  return globalThis.opendirMemorySubmissions;
}

export function normalizeProjectUrl(value: string) {
  const url = new URL(value);
  url.hash = "";
  url.search = "";
  url.hostname = url.hostname.toLowerCase();
  url.pathname = url.pathname.replace(/\/+$/, "") || "/";
  return url.toString();
}

function rowToSubmission(row: Record<string, unknown>): SubmissionRecord {
  return {
    id: String(row.id),
    name: String(row.name),
    url: String(row.url),
    description: String(row.description),
    category: String(row.category),
    tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
    repositoryUrl: row.repository_url ? String(row.repository_url) : undefined,
    submittedBy: String(row.submitted_by),
    status: String(row.status) as SubmissionStatus,
    validationErrors: Array.isArray(row.validation_errors)
      ? row.validation_errors
      : [],
    reviewedBy: row.reviewed_by ? String(row.reviewed_by) : undefined,
    reviewReason: row.review_reason ? String(row.review_reason) : undefined,
    reviewedAt: row.reviewed_at
      ? new Date(String(row.reviewed_at)).toISOString()
      : undefined,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString(),
  };
}

export async function createSubmission(input: SubmissionInput) {
  const id = `sub_${randomUUID().replaceAll("-", "")}`;
  const now = new Date().toISOString();
  const normalizedUrl = normalizeProjectUrl(input.url);
  const submittedBy = normalizeSubmittedBy(input.submitted_by);
  const repositoryUrl = input.repository_url;
  const sql = getDatabase();

  if (!sql) {
    const store = memoryStore();
    if ([...store.values()].some((record) => normalizeProjectUrl(record.url) === normalizedUrl)) {
      throw new DuplicateSubmissionError();
    }
    const record: SubmissionRecord = {
      id,
      name: input.name,
      url: input.url,
      description: input.description,
      category: input.category,
      tags: input.tags,
      repositoryUrl,
      submittedBy,
      status: "review",
      validationErrors: [],
      createdAt: now,
      updatedAt: now,
    };
    store.set(id, record);
    return { record, storage: "memory" as const };
  }

  try {
    const [row] = await sql.begin(async (transaction) => {
      const inserted = await transaction`
        INSERT INTO submissions (
          id, name, url, normalized_url, description, category, tags,
          repository_url, submitted_by, status
        ) VALUES (
          ${id}, ${input.name}, ${input.url}, ${normalizedUrl},
          ${input.description}, ${input.category}, ${input.tags},
          ${repositoryUrl ?? null}, ${submittedBy}, 'review'
        )
        RETURNING *
      `;
      await transaction`
        INSERT INTO submission_events (submission_id, event_type, detail)
        VALUES (${id}, 'received', ${transaction.json({ source: submittedBy })})
      `;
      return inserted;
    });
    return { record: rowToSubmission(row), storage: "postgres" as const };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    ) {
      throw new DuplicateSubmissionError();
    }
    throw error;
  }
}

export async function getSubmission(id: string) {
  const sql = getDatabase();
  if (!sql) return memoryStore().get(id) ?? null;
  const rows = await sql`SELECT * FROM submissions WHERE id = ${id} LIMIT 1`;
  return rows[0] ? rowToSubmission(rows[0]) : null;
}

export async function listRecentSubmissions(limit = 20) {
  const safeLimit = Math.min(50, Math.max(1, limit));
  const sql = getDatabase();
  if (!sql) {
    return [...memoryStore().values()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, safeLimit);
  }
  const rows = await sql`
    SELECT * FROM submissions
    ORDER BY created_at DESC
    LIMIT ${safeLimit}
  `;
  return rows.map(rowToSubmission);
}

export type SubmissionEvent = {
  eventType: string;
  detail: Record<string, unknown>;
  createdAt: string;
};

export async function getSubmissionEvents(id: string) {
  const sql = getDatabase();
  if (!sql) return [] as SubmissionEvent[];
  const rows = await sql`
    SELECT event_type, detail, created_at
    FROM submission_events
    WHERE submission_id = ${id}
    ORDER BY created_at ASC
  `;
  return rows.map((row) => ({
    eventType: String(row.event_type),
    detail:
      typeof row.detail === "object" && row.detail !== null
        ? (row.detail as Record<string, unknown>)
        : {},
    createdAt: new Date(String(row.created_at)).toISOString(),
  }));
}

export async function listReviewSubmissions(limit = 100) {
  const safeLimit = Math.min(200, Math.max(1, limit));
  const sql = getDatabase();
  if (!sql) {
    return [...memoryStore().values()]
      .filter((record) => record.status === "review")
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .slice(0, safeLimit);
  }
  const rows = await sql`
    SELECT * FROM submissions
    WHERE status = 'review'
    ORDER BY created_at ASC
    LIMIT ${safeLimit}
  `;
  return rows.map(rowToSubmission);
}

export async function reviewSubmission(options: {
  id: string;
  decision: "published" | "rejected";
  reviewer: string;
  reason?: string;
}) {
  const sql = getDatabase();
  if (!sql) {
    const record = memoryStore().get(options.id);
    if (!record || record.status !== "review") return null;
    const now = new Date().toISOString();
    const updated = {
      ...record,
      status: options.decision,
      reviewedBy: options.reviewer,
      reviewReason: options.reason,
      reviewedAt: now,
      updatedAt: now,
    };
    memoryStore().set(options.id, updated);
    return updated;
  }

  return sql.begin(async (transaction) => {
    const rows = await transaction`
      SELECT * FROM submissions
      WHERE id = ${options.id} AND status = 'review'
      FOR UPDATE
    `;
    if (!rows[0]) return null;
    const submission = rowToSubmission(rows[0]);

    const updatedRows = await transaction`
      UPDATE submissions
      SET status = ${options.decision},
          reviewed_by = ${options.reviewer},
          review_reason = ${options.reason ?? null},
          reviewed_at = NOW(),
          updated_at = NOW()
      WHERE id = ${options.id}
      RETURNING *
    `;

    if (options.decision === "published") {
      await transaction`
        INSERT INTO projects (
          id, submission_id, name, url, normalized_url, description,
          category, tags, repository_url, submitted_by, status
        ) VALUES (
          ${submission.id}, ${submission.id}, ${submission.name},
          ${submission.url}, ${normalizeProjectUrl(submission.url)},
          ${submission.description}, ${submission.category}, ${submission.tags},
          ${submission.repositoryUrl ?? null}, ${submission.submittedBy}, 'published'
        )
        ON CONFLICT (submission_id) DO UPDATE SET
          name = EXCLUDED.name,
          url = EXCLUDED.url,
          normalized_url = EXCLUDED.normalized_url,
          description = EXCLUDED.description,
          category = EXCLUDED.category,
          tags = EXCLUDED.tags,
          repository_url = EXCLUDED.repository_url,
          submitted_by = EXCLUDED.submitted_by,
          status = 'published',
          updated_at = NOW()
      `;
    }

    await transaction`
      INSERT INTO submission_events (submission_id, event_type, detail)
      VALUES (
        ${options.id},
        ${options.decision},
        ${transaction.json({ reviewer: options.reviewer, reason: options.reason ?? null })}
      )
    `;
    return rowToSubmission(updatedRows[0]);
  });
}

export async function getDirectoryStats() {
  const sql = getDatabase();
  if (!sql) {
    const submissions = [...memoryStore().values()];
    return {
      published: submissions.filter((item) => item.status === "published").length,
      submissions: submissions.length,
      awaitingReview: submissions.filter((item) => item.status === "review").length,
    };
  }
  const [row] = await sql`
    SELECT
      (SELECT COUNT(*)::int FROM projects WHERE status = 'published') AS published,
      (SELECT COUNT(*)::int FROM submissions) AS submissions,
      (SELECT COUNT(*)::int FROM submissions WHERE status = 'review') AS awaiting_review
  `;
  return {
    published: Number(row.published),
    submissions: Number(row.submissions),
    awaitingReview: Number(row.awaiting_review),
  };
}

export async function searchProjects(options: {
  query?: string;
  category?: string;
  page?: number;
  pageSize?: number;
}) {
  const query = options.query?.trim() ?? "";
  const category = options.category?.trim() ?? "";
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, options.pageSize ?? 10));
  const sql = getDatabase();

  if (!sql) {
    const filtered = [...memoryStore().values()]
      .filter((project) => project.status === "published")
      .filter(
        (project) =>
          (!category || project.category === category) &&
          (!query ||
            `${project.name} ${project.description} ${project.tags.join(" ")}`
              .toLowerCase()
              .includes(query.toLowerCase())),
      )
      .map((project) => ({
        id: project.id,
        name: project.name,
        url: project.url,
        description: project.description,
        category: project.category,
        tags: project.tags,
        submitted_by: project.submittedBy,
        status: "Published" as const,
        updated_at: project.updatedAt,
      }));
    return {
      projects: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pageSize,
      storage: "memory" as const,
    };
  }

  const pattern = `%${query}%`;
  const offset = (page - 1) * pageSize;
  const rows = await sql`
    SELECT *, COUNT(*) OVER()::int AS total_count
    FROM projects
    WHERE status = 'published'
      AND (${category} = '' OR category = ${category})
      AND (
        ${query} = '' OR name ILIKE ${pattern} OR description ILIKE ${pattern}
        OR array_to_string(tags, ' ') ILIKE ${pattern}
      )
    ORDER BY updated_at DESC
    LIMIT ${pageSize} OFFSET ${offset}
  `;

  return {
    projects: rows.map((row) => ({
      id: String(row.id),
      name: String(row.name),
      url: String(row.url),
      description: String(row.description),
      category: String(row.category),
      tags: Array.isArray(row.tags) ? row.tags.map(String) : [],
      status: "Published" as const,
      submitted_by: String(row.submitted_by),
      updated_at: new Date(String(row.updated_at)).toISOString(),
    })),
    total: rows[0] ? Number(rows[0].total_count) : 0,
    page,
    pageSize,
    storage: "postgres" as const,
  };
}

export function storageMode() {
  return hasDatabase() ? "postgres" : "memory";
}
