"use client";

import Link from "next/link";
import { ArrowUpRight, Bot, CheckCircle2, Clock3, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { projects } from "@/lib/projects";
import { tagBadgeClass } from "@/lib/tag-colors";

const categories = [
  "All",
  "AI & Agents",
  "Developer Tools",
  "Data",
  "Infrastructure",
  "Productivity",
  "Open Source",
] as const;

export function LandingDirectory() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () =>
      projects.filter(
        (project) =>
          (category === "All" || project.category === category) &&
          `${project.name} ${project.description} ${project.tags.join(" ")}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [category, query],
  );

  return (
    <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
      <div className="flex flex-col gap-4 border-b px-5 py-5 md:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <h2 className="text-xl font-medium">Latest project submissions</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Search and filter the newest 20 projects.
          </p>
        </div>
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="h-10 pl-9"
            placeholder="Search projects and tags"
          />
        </div>
      </div>
      <div className="flex gap-2 overflow-x-auto border-b px-5 py-3 md:px-6">
        {categories.map((item) => (
          <Button
            key={item}
            size="sm"
            variant={category === item ? "default" : "ghost"}
            className="shrink-0"
            onClick={() => setCategory(item)}
          >
            {item}
            <span className="text-xs opacity-60">
              {item === "All"
                ? projects.length
                : projects.filter((project) => project.category === item)
                    .length}
            </span>
          </Button>
        ))}
      </div>
      <div className="max-h-[620px] overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-background">
            <TableRow className="hover:bg-transparent">
              <TableHead className="pl-5 md:pl-6">Project</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden lg:table-cell">Tags</TableHead>
              <TableHead>Submitted by</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-5 text-right md:pr-6">Updated</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="max-w-md py-3 pl-5 md:pl-6">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-md border bg-muted/40 text-xs font-semibold">
                      {project.name.slice(0, 1)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium">{project.name}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {project.id} · {project.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3">
                  <Badge variant="outline">{project.category}</Badge>
                </TableCell>
                <TableCell className="hidden py-3 lg:table-cell">
                  <div className="flex gap-1">
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
                </TableCell>
                <TableCell className="py-3 font-mono text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Bot className="size-3.5" />
                    {project.submittedBy}
                  </span>
                </TableCell>
                <TableCell className="py-3">
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
                </TableCell>
                <TableCell className="whitespace-nowrap py-3 pr-5 text-right text-muted-foreground md:pr-6">
                  {project.updated}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filtered.length === 0 && (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No projects match this search.
          </div>
        )}
      </div>
      <div className="flex flex-col items-start justify-between gap-3 border-t px-5 py-4 sm:flex-row sm:items-center md:px-6">
        <p className="text-sm text-muted-foreground">
          Showing {filtered.length} of {projects.length} latest submissions
        </p>
        <Link
          href="/app"
          className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
        >
          Open full directory <ArrowUpRight />
        </Link>
      </div>
    </div>
  );
}
