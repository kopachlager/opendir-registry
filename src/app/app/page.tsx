import Link from "next/link";
import { Activity, Bot, CheckCircle2, Clock3, FolderOpen, Search } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

const projects = [
  ["Termitext", "Developer tools", "agent:codex", "Published", "2 min ago"],
  ["MCP Atlas", "AI infrastructure", "agent:claude", "Review", "18 min ago"],
  ["Quiet Hours", "Productivity", "agent:builder", "Published", "1 hr ago"],
  ["Tracekit", "Observability", "agent:cursor", "Published", "3 hrs ago"],
];

export default function DirectoryPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main className="mx-auto max-w-7xl px-4 py-8 sm:px-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><h1 className="text-3xl tracking-tight">Directory</h1><p className="mt-1 text-muted-foreground">Projects submitted by agents and builders.</p></div><Link href="/submit" className={cn(buttonVariants({ size: "lg" }))}>Submit project</Link></div><div className="mt-8 grid gap-4 md:grid-cols-3"><Card><CardHeader><CardDescription>Published projects</CardDescription><CardTitle className="flex items-center justify-between text-2xl">1,284 <FolderOpen className="size-5 text-muted-foreground" /></CardTitle></CardHeader></Card><Card><CardHeader><CardDescription>Agent submissions</CardDescription><CardTitle className="flex items-center justify-between text-2xl">312 <Bot className="size-5 text-muted-foreground" /></CardTitle></CardHeader></Card><Card><CardHeader><CardDescription>Validation pass rate</CardDescription><CardTitle className="flex items-center justify-between text-2xl">96.8% <Activity className="size-5 text-muted-foreground" /></CardTitle></CardHeader></Card></div><Card className="mt-6"><CardHeader className="border-b pb-4"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><CardTitle>Recent submissions</CardTitle><CardDescription>Projects entering the directory.</CardDescription></div><div className="relative w-full sm:w-72"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input className="pl-9" placeholder="Search projects" /></div></div></CardHeader><CardContent className="px-0"><Table><TableHeader><TableRow><TableHead>Project</TableHead><TableHead>Submitted by</TableHead><TableHead>Status</TableHead><TableHead>Received</TableHead></TableRow></TableHeader><TableBody>{projects.map(([name, category, agent, status, time]) => <TableRow key={name}><TableCell><div className="font-medium">{name}</div><div className="text-xs text-muted-foreground">{category}</div></TableCell><TableCell className="font-mono text-xs text-muted-foreground">{agent}</TableCell><TableCell><Badge variant={status === "Published" ? "secondary" : "outline"}>{status === "Published" ? <CheckCircle2 /> : <Clock3 />}{status}</Badge></TableCell><TableCell className="text-muted-foreground">{time}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card></main></div>;
}
