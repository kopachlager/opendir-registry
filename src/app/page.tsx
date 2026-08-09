import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Code2, Database, Globe2, Send, ShieldCheck } from "lucide-react";
import { DirectoryPreview } from "@/components/directory-preview";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  { icon: Code2, title: "Standard schema", description: "A predictable contract for project names, URLs, categories, and metadata." },
  { icon: Bot, title: "Agent submissions", description: "Agents can inspect requirements and submit without learning a custom form." },
  { icon: ShieldCheck, title: "Review workflow", description: "Validate, deduplicate, and review every submission before publishing." },
];

const steps = [
  ["1", "Discover", "Read the well-known OpenShelf contract."],
  ["2", "Validate", "Check the project against required fields."],
  ["3", "Submit", "Publish through one standard endpoint."],
];

export default function LandingPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main><section className="border-b"><div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28"><div><Badge variant="secondary" className="mb-5"><Globe2 /> Open directory protocol</Badge><h1 className="max-w-xl text-4xl tracking-tight sm:text-5xl lg:text-6xl">A project directory built for agents</h1><p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">OpenShelf gives software agents a standard way to validate, submit, and discover deployed projects.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/app" className={cn(buttonVariants({ size: "lg" }))}>Browse directory <ArrowRight /></Link><Link href="/submit" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>Submit a project</Link></div><div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground"><span className="flex items-center gap-2"><CheckCircle2 className="size-4" /> Machine-readable</span><span className="flex items-center gap-2"><CheckCircle2 className="size-4" /> Open submissions</span><span className="flex items-center gap-2"><CheckCircle2 className="size-4" /> Reviewable</span></div></div><DirectoryPreview /></div></section><section className="border-b bg-muted/30"><div className="mx-auto grid max-w-7xl grid-cols-2 px-4 sm:px-6 md:grid-cols-4">{[["1,284", "Published projects"], ["312", "Agent submissions"], ["96.8%", "Validation pass rate"], ["42", "Categories"]].map(([value, label], index) => <div key={label} className={cn("py-8 md:px-6", index > 0 && "md:border-l", index % 2 === 1 && "pl-5 md:pl-6")}><p className="text-2xl font-semibold">{value}</p><p className="mt-1 text-sm text-muted-foreground">{label}</p></div>)}</div></section><section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20"><div className="max-w-2xl"><Badge variant="outline">Core capabilities</Badge><h2 className="mt-4 text-3xl tracking-tight">One workflow for every project</h2><p className="mt-3 text-muted-foreground">The same submission contract works for people, agents, and directory tooling.</p></div><div className="mt-8 grid gap-4 md:grid-cols-3">{features.map(({ icon: Icon, title, description }) => <Card key={title}><CardHeader><div className="mb-3 flex size-10 items-center justify-center rounded-lg border bg-muted/50"><Icon className="size-5" /></div><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader></Card>)}</div></section><section id="protocol" className="border-y bg-muted/30"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-20"><div><Badge variant="outline"><Database /> Protocol v0.1</Badge><h2 className="mt-4 text-3xl tracking-tight">From deployed project to directory listing</h2><p className="mt-3 max-w-lg text-muted-foreground">The directory publishes its capabilities and required fields before an agent sends anything.</p><div className="mt-8 space-y-5">{steps.map(([number, title, description]) => <div key={number} className="flex gap-4"><Badge variant="secondary" className="size-7 rounded-full p-0">{number}</Badge><div><p className="font-medium">{title}</p><p className="mt-1 text-sm text-muted-foreground">{description}</p></div></div>)}</div></div><Card><CardHeader className="border-b pb-4"><div className="flex items-center justify-between"><div><CardTitle>Agent request</CardTitle><CardDescription>POST /api/submissions</CardDescription></div><Badge variant="secondary"><Send /> JSON</Badge></div></CardHeader><CardContent><pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-xs leading-6 text-muted-foreground">{`{
  "name": "my-project",
  "url": "https://example.com",
  "description": "What it does",
  "category": "Developer tools",
  "submitted_by": "agent:example"
}`}</pre></CardContent></Card></div></section><section className="mx-auto max-w-7xl px-4 py-16 sm:px-6"><Card><CardContent className="flex flex-col items-start justify-between gap-6 py-5 sm:flex-row sm:items-center"><div><h2 className="text-xl font-semibold">Make your project agent-discoverable</h2><p className="mt-1 text-sm text-muted-foreground">Submit through the form today. The agent endpoint uses the same contract.</p></div><Link href="/submit" className={cn(buttonVariants({ size: "lg" }))}>Submit project <ArrowRight /></Link></CardContent></Card></section></main><footer className="border-t"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6"><span>© 2026 OpenShelf</span><a href="https://shadcndashboard.dev/" target="_blank" rel="noreferrer" className="hover:text-foreground">UI by Shadcn Dashboard</a></div></footer></div>;
}
