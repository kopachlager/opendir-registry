import type { ProjectListing } from "@/lib/projects";

type ApiSubmission = {
  id: string;
  name: string;
  url: string;
  description: string;
  category: ProjectListing["category"];
  tags: string[];
  submitted_by: string;
  status: string;
  updated_at: string;
};

export async function loadDirectorySubmissions() {
  const response = await fetch("/api/v1/submissions?limit=20");
  if (!response.ok) return [];
  const payload = (await response.json()) as { submissions?: ApiSubmission[] };
  return (payload.submissions ?? []).map(
    (submission): ProjectListing => ({
      id: submission.id,
      name: submission.name,
      url: submission.url,
      description: submission.description,
      category: submission.category,
      tags: submission.tags,
      submittedBy: submission.submitted_by,
      status: submission.status === "published" ? "Published" : "Review",
      updated: new Date(submission.updated_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
    }),
  );
}
