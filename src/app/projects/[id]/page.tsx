import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowUpRight,
  Bot,
  CheckCircle2,
  Clock3,
  FileJson2,
  Globe2,
  Tag,
} from "lucide-react";
import { PatternDivider } from "@/components/pattern-divider";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import type { ProjectListing } from "@/lib/projects";
import { getSubmission } from "@/lib/submissions";
import { tagBadgeClass } from "@/lib/tag-colors";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidate = await getSubmission(id);
  const submission = candidate?.status === "published" ? candidate : null;
  const project =
    submission
      ? {
          id: submission.id,
          name: submission.name,
          url: submission.url,
          description: submission.description,
          category: submission.category as ProjectListing["category"],
          tags: submission.tags,
          submittedBy: submission.submittedBy,
          status: "Approved" as const,
          updated: new Date(submission.updatedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
        }
      : null;

  if (!project) notFound();

  const record = {
    id: project.id,
    name: project.name,
    url: project.url,
    description: project.description,
    category: project.category,
    submitted_by: project.submittedBy,
    status: project.status.toLowerCase(),
    tags: project.tags,
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <PatternDivider />
      <main className="mx-auto max-w-[1180px] border-x">
        <div className="border-b px-6 py-8 md:px-10 md:py-10">
          <Link
            href="/app"
            className={cn(buttonVariants({ variant: "ghost" }), "mb-7 -ml-2")}
          >
            <ArrowLeft /> Back to directory
          </Link>

          <div className="flex flex-col justify-between gap-7 md:flex-row md:items-start">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant="outline">{project.category}</Badge>
                <Badge
                  variant={
                    project.status === "Approved" ? "secondary" : "outline"
                  }
                >
                  {project.status === "Approved" ? (
                    <CheckCircle2 />
                  ) : (
                    <Clock3 />
                  )}
                  {project.status}
                </Badge>
              </div>
              <h1 className="text-3xl font-medium tracking-tight md:text-4xl">
                {project.name}
              </h1>
              <p className="mt-3 font-mono text-sm text-muted-foreground">
                {project.id}
              </p>
            </div>
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className={cn(buttonVariants({ size: "lg" }), "h-10 px-5")}
            >
              Visit project <ArrowUpRight />
            </a>
          </div>
        </div>

        <section className="border-b">
          <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
            <div className="border-b p-6 lg:border-b-0 lg:border-r md:p-10">
              <p className="text-sm font-medium text-muted-foreground">
                Description
              </p>
              <p className="mt-4 max-w-3xl text-lg leading-8">
                {project.description}
              </p>

              <div className="mt-10 border-t pt-7">
                <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Globe2 className="size-4" /> Submitted URL
                </p>
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 block break-all font-mono text-sm underline underline-offset-4"
                >
                  {project.url}
                </a>
              </div>
            </div>

            <aside className="divide-y">
              <div className="p-6 md:p-8">
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="mt-3 font-medium">{project.category}</p>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-sm text-muted-foreground">Submitted by</p>
                <p className="mt-3 flex items-center gap-2 font-mono text-sm">
                  <Bot className="size-4" /> {project.submittedBy}
                </p>
              </div>
              <div className="p-6 md:p-8">
                <p className="text-sm text-muted-foreground">Last updated</p>
                <p className="mt-3 text-sm font-medium">{project.updated}</p>
              </div>
              <div className="p-6 md:p-8">
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Tag className="size-4" /> Tags
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={tagBadgeClass(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="px-6 py-8 md:px-10">
          <details className="group border">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-sm font-medium hover:bg-muted/40">
              <span className="flex items-center gap-2">
                <FileJson2 className="size-4" /> Technical submission details
              </span>
              <span className="text-xs font-normal text-muted-foreground group-open:hidden">
                Show metadata
              </span>
              <span className="hidden text-xs font-normal text-muted-foreground group-open:inline">
                Hide metadata
              </span>
            </summary>
            <div className="grid border-t lg:grid-cols-2">
              <div className="border-b p-5 lg:border-b-0 lg:border-r">
                <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Normalized record
                </p>
                <pre className="overflow-x-auto bg-muted p-4 font-mono text-xs leading-6 text-muted-foreground">
                  {JSON.stringify(record, null, 2)}
                </pre>
              </div>
              <div className="space-y-5 p-5">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Review trail
                </p>
                <div className="border-l-2 pl-4">
                  <p className="text-sm font-medium">Record received</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Metadata accepted from {project.submittedBy}.
                  </p>
                </div>
                <div className="border-l-2 pl-4">
                  <p className="text-sm font-medium">Validation complete</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    URL, required fields, and category passed validation.
                  </p>
                </div>
              </div>
            </div>
          </details>
        </section>
      </main>
    </div>
  );
}
