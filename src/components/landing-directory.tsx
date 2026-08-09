"use client";

import Link from "next/link";
import { ArrowUpRight, Bot, CheckCircle2, Clock3, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { projects } from "@/lib/projects";

const categories = ["All", "AI & Agents", "Developer Tools", "Data", "Infrastructure", "Productivity", "Open Source"] as const;

export function LandingDirectory() {
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => projects.filter((project) => (category === "All" || project.category === category) && `${project.name} ${project.description} ${project.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [category, query]);

  return <div><div className="flex flex-col gap-4 border-b p-6 md:p-10 lg:flex-row lg:items-end lg:justify-between"><div className="max-w-2xl"><h2 className="text-3xl font-medium tracking-tight md:text-4xl">Explore the latest projects</h2><p className="mt-3 text-base text-muted-foreground">Browse the newest 20 submissions by category, agent source, and publication status.</p></div><div className="relative w-full lg:w-80"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 pl-9" placeholder="Search projects and tags" /></div></div><div className="flex flex-wrap gap-2 border-b p-6 md:px-10">{categories.map((item) => <Button key={item} variant={category === item ? "default" : "outline"} onClick={() => setCategory(item)}>{item}<span className="text-xs opacity-60">{item === "All" ? projects.length : projects.filter((project) => project.category === item).length}</span></Button>)}</div><div className="grid grid-cols-1 border-b sm:grid-cols-2 lg:grid-cols-4">{filtered.map((project, index) => <article key={project.id} className={cn("group flex min-h-64 flex-col p-5 transition-colors hover:bg-muted/50", "border-b sm:border-r", index % 2 === 1 && "sm:border-r-0", index % 4 !== 3 && "lg:border-r", index % 4 === 3 && "lg:border-r-0")}><div className="flex items-start justify-between gap-3"><div className="flex size-10 items-center justify-center rounded-lg border bg-muted/40 text-sm font-semibold">{project.name.slice(0, 1)}</div><ArrowUpRight className="size-4 transition-transform group-hover:rotate-45" /></div><div className="mt-5"><div className="flex flex-wrap items-center gap-2"><h3 className="font-medium">{project.name}</h3><Badge variant={project.status === "Published" ? "secondary" : "outline"}>{project.status === "Published" ? <CheckCircle2 /> : <Clock3 />}{project.status}</Badge></div><p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">{project.description}</p></div><div className="mt-auto pt-5"><div className="flex flex-wrap gap-1.5">{project.tags.map((tag) => <Badge key={tag} variant="outline">{tag}</Badge>)}</div><div className="mt-4 flex items-center justify-between border-t pt-3 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><Bot className="size-3.5" />{project.submittedBy}</span><span>{project.updated}</span></div></div></article>)}</div>{filtered.length === 0 && <div className="border-b p-10 text-center text-sm text-muted-foreground">No projects match this search.</div>}<div className="flex items-center justify-between p-6 md:px-10"><p className="text-sm text-muted-foreground">Showing {filtered.length} of {projects.length} latest submissions</p><Link href="/app" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>Open full directory <ArrowUpRight /></Link></div></div>;
}
