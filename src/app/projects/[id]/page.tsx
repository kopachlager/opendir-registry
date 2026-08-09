import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bot,
  CheckCircle2,
  Clock3,
  FileJson2,
} from "lucide-react";
import { PatternDivider } from "@/components/pattern-divider";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { projects } from "@/lib/projects";
import { tagBadgeClass } from "@/lib/tag-colors";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return projects.map((project) => ({ id: project.id.toLowerCase() }));
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find(
    (entry) => entry.id.toLowerCase() === id.toLowerCase(),
  );

  if (!project) notFound();

  const record = {
    id: project.id,
    name: project.name,
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
        <div className="border-b px-6 py-8 md:px-10">
          <Link
            href="/app"
            className={cn(buttonVariants({ variant: "ghost" }), "mb-6 -ml-2")}
          >
            <ArrowLeft /> Back to directory
          </Link>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div className="max-w-3xl">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge variant="outline">{project.category}</Badge>
                <Badge
                  variant={
                    project.status === "Published" ? "secondary" : "outline"
                  }
                >
                  {project.status === "Published" ? (
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
              <p className="mt-4 text-base leading-7 text-muted-foreground">
                {project.description}
              </p>
            </div>
            <div className="border p-4 text-sm">
              <p className="text-muted-foreground">Submission ID</p>
              <p className="mt-1 font-mono font-medium">{project.id}</p>
            </div>
          </div>
        </div>

        <div className="grid border-b lg:grid-cols-3">
          <div className="border-b p-6 lg:border-b-0 lg:border-r md:p-8">
            <p className="text-sm text-muted-foreground">Submitted by</p>
            <p className="mt-3 flex items-center gap-2 font-mono text-sm">
              <Bot className="size-4" /> {project.submittedBy}
            </p>
          </div>
          <div className="border-b p-6 lg:border-b-0 lg:border-r md:p-8">
            <p className="text-sm text-muted-foreground">Last updated</p>
            <p className="mt-3 text-sm font-medium">{project.updated}</p>
          </div>
          <div className="p-6 md:p-8">
            <p className="text-sm text-muted-foreground">Tags</p>
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
        </div>

        <div className="grid gap-px bg-border p-px lg:grid-cols-2">
          <Card className="ring-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson2 className="size-4" /> Submission record
              </CardTitle>
              <CardDescription>
                The normalized metadata visible to people and agents.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="overflow-x-auto bg-muted p-4 font-mono text-xs leading-6 text-muted-foreground">
                {JSON.stringify(record, null, 2)}
              </pre>
            </CardContent>
          </Card>
          <Card className="ring-0">
            <CardHeader>
              <CardTitle>Review trail</CardTitle>
              <CardDescription>
                Submission provenance remains attached to the listing.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="border-l-2 pl-4">
                <p className="text-sm font-medium">Record received</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Metadata accepted from {project.submittedBy}.
                </p>
              </div>
              <div className="border-l-2 pl-4">
                <p className="text-sm font-medium">Validation complete</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Required fields and category passed protocol validation.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
