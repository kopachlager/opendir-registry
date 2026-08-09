import type { ProjectListing } from "@/lib/projects";

type ApiProject = {
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

export async function loadDirectoryProjects() {
  const response = await fetch("/api/v1/projects?page_size=50");
  if (!response.ok) return [];
  const payload = (await response.json()) as { projects?: ApiProject[] };
  return (payload.projects ?? []).map(
    (project): ProjectListing => ({
      id: project.id,
      name: project.name,
      url: project.url,
      description: project.description,
      category: project.category,
      tags: project.tags,
      submittedBy: project.submitted_by,
      status: "Published",
      updated: new Date(project.updated_at).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
    }),
  );
}
