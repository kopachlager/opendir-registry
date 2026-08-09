import { randomUUID } from "node:crypto";
import { getDatabase, hasDatabase } from "@/lib/db";
import {
  normalizeSubmittedBy,
  type SubmissionInput,
  type SubmissionStatus,
} from "@/lib/protocol";
import { projects as demoProjects } from "@/lib/projects";

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
  var openshelfMemorySubmissions: Map<string, SubmissionRecord> | undefined;
}

function memoryStore() {
  if (!globalThis.openshelfMemorySubmissions) {
    globalThis.openshelfMemorySubmissions = new Map();
  }
  return globalThis.openshelfMemorySubmissions;
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
    const filtered = demoProjects.filter(
      (project) =>
        (!category || project.category === category) &&
        (!query ||
          `${project.name} ${project.description} ${project.tags.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase())),
    );
    return {
      projects: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pageSize,
      storage: "demo" as const,
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
      submittedBy: String(row.submitted_by),
      status: "Published" as const,
      updated: new Date(String(row.updated_at)).toISOString(),
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
