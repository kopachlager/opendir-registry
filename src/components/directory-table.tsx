"use client";

import {
  ArrowDownUp,
  Bot,
  CheckCircle2,
  Clock3,
  Ellipsis,
  FolderOpen,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { DashboardCard } from "@/components/dashboard-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

export function DirectoryTable() {
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
    <DashboardCard className="gap-0">
      <CardHeader className="border-b py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="size-4" />
              Project directory
            </CardTitle>
            <CardDescription>
              {filtered.length} projects in the current view.
            </CardDescription>
          </div>
          <div className="relative w-full xl:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="pl-9"
              placeholder="Search projects and tags"
            />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {categories.map((item) => (
            <Button
              key={item}
              size="sm"
              variant={category === item ? "default" : "outline"}
              onClick={() => setCategory(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>
                <span className="flex items-center gap-1.5">
                  Project <ArrowDownUp className="size-3.5" />
                </span>
              </TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Submitted by</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="max-w-sm">
                  <div className="font-medium">{project.name}</div>
                  <div className="line-clamp-1 text-xs text-muted-foreground">
                    {project.id} · {project.description}
                  </div>
                  <div className="mt-2 flex gap-1">
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
                <TableCell>
                  <Badge variant="outline">{project.category}</Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Bot className="size-3.5" />
                    {project.submittedBy}
                  </span>
                </TableCell>
                <TableCell>
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
                <TableCell className="whitespace-nowrap text-muted-foreground">
                  {project.updated}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Actions for ${project.name}`}
                  >
                    <Ellipsis />
                  </Button>
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
      </CardContent>
    </DashboardCard>
  );
}
