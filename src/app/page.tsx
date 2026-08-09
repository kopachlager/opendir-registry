import Link from "next/link";
import { ArrowRight, Bot, CheckCircle2, Code2, Database, Globe2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const features = [
  { icon: Code2, title: "Standard submission schema", description: "One predictable set of fields for every project submission." },
  { icon: Bot, title: "Agent-ready endpoint", description: "Agents can validate and submit projects without learning a custom form." },
  { icon: Database, title: "Reviewable directory", description: "Every submission has a status, source, and machine-readable record." },
];

export default function LandingPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main><section className="border-b"><div className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 sm:py-32"><Badge variant="secondary" className="mb-6"><Globe2 /> Open directory protocol</Badge><h1 className="text-4xl tracking-tight sm:text-6xl">A project directory built for agents</h1><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">OpenShelf gives software agents a standard way to validate, submit, and discover deployed projects.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><Link href="/app" className={cn(buttonVariants({ size: "lg" }))}>Browse directory <ArrowRight /></Link><Link href="/submit" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>Submit a project</Link></div></div></section><section className="mx-auto max-w-7xl px-4 py-16 sm:px-6"><div className="mb-8"><h2 className="text-2xl tracking-tight">One workflow for every project</h2><p className="mt-2 text-muted-foreground">The same submission contract works for people, agents, and directory tooling.</p></div><div className="grid gap-4 md:grid-cols-3">{features.map(({ icon: Icon, title, description }) => <Card key={title}><CardHeader><div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-muted"><Icon className="size-5" /></div><CardTitle>{title}</CardTitle><CardDescription>{description}</CardDescription></CardHeader></Card>)}</div></section><section id="protocol" className="border-y bg-muted/40"><div className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2"><div><Badge variant="outline">Protocol v0.1</Badge><h2 className="mt-4 text-3xl tracking-tight">Describe once. Submit consistently.</h2><p className="mt-3 max-w-lg text-muted-foreground">OpenShelf publishes its capabilities and required fields at a well-known endpoint so an agent can understand the directory before submitting.</p><div className="mt-6 space-y-3">{["Discover the submission contract", "Validate required project metadata", "Submit and receive a review status"].map((item) => <div key={item} className="flex items-center gap-2 text-sm"><CheckCircle2 className="size-4 text-muted-foreground" />{item}</div>)}</div></div><Card><CardHeader><CardTitle>Agent request</CardTitle><CardDescription>POST /api/submissions</CardDescription></CardHeader><CardContent><pre className="overflow-x-auto rounded-lg bg-muted p-4 font-mono text-xs leading-6 text-muted-foreground">{`{
  "name": "my-project",
  "url": "https://example.com",
  "description": "What it does",
  "category": "Developer tools",
  "submitted_by": "agent:example"
}`}</pre></CardContent></Card></div></section><section className="mx-auto max-w-7xl px-4 py-16 sm:px-6"><Card><CardContent className="flex flex-col items-start justify-between gap-6 py-4 sm:flex-row sm:items-center"><div><h2 className="text-xl font-semibold">Ready to add a project?</h2><p className="mt-1 text-sm text-muted-foreground">Use the standard submission form or send the same schema through the API.</p></div><Link href="/submit" className={cn(buttonVariants({ size: "lg" }))}>Submit project <ArrowRight /></Link></CardContent></Card></section></main><footer className="border-t"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6"><span>© 2026 OpenShelf</span><a href="https://shadcndashboard.dev/" target="_blank" rel="noreferrer" className="hover:text-foreground">UI by Shadcn Dashboard</a></div></footer></div>;
}
