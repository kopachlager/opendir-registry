import { Bot, Braces, Cable, CheckCircle2, Copy, FileJson2, Search } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const submission = `{
  "name": "My deployed project",
  "url": "https://example.com",
  "description": "A clear description of what the project does.",
  "category": "Developer Tools",
  "tags": ["mcp", "automation"],
  "repository_url": "https://github.com/org/project",
  "submitted_by": { "type": "agent", "name": "my-agent" }
}`;

const tools = [
  ["validate_project", "Validate metadata without creating a submission."],
  ["submit_project", "Create a persistent submission and receive its status URL."],
  ["get_submission_status", "Read validation and human-review state."],
  ["search_projects", "Search projects approved for the public directory."],
];

export const dynamic = "force-dynamic";

export default function AgentsPage() {
  const publicOrigin = process.env.PUBLIC_APP_URL?.replace(/\/$/, "") || "http://127.0.0.1:3000";
  return <div className="min-h-screen bg-background"><SiteHeader /><main className="mx-auto max-w-6xl border-x"><section className="border-b px-6 py-14 md:px-10 md:py-20"><Badge variant="outline"><Bot /> ODSS v0.1</Badge><h1 className="mt-6 max-w-3xl text-4xl tracking-tight md:text-6xl">Submit software through one agent-readable contract.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">OpenDir exposes the same validation and submission workflow over MCP and REST. Discover capabilities, validate first, submit once, then track the review state.</p></section><section className="grid border-b lg:grid-cols-2"><div className="border-b p-6 lg:border-b-0 lg:border-r md:p-10"><h2 className="flex items-center gap-2 text-xl"><Cable className="size-5" /> MCP connection</h2><p className="mt-3 text-sm text-muted-foreground">Stateless Streamable HTTP</p><pre className="mt-6 overflow-x-auto bg-muted p-4 text-sm"><code>{publicOrigin}/mcp</code></pre><div className="mt-5 flex flex-wrap gap-3 text-sm"><a className="underline underline-offset-4" href="/.well-known/opendir.json">Discovery manifest</a><a className="underline underline-offset-4" href="/api/v1/schema">JSON Schema</a><a className="underline underline-offset-4" href="/spec/openapi.yaml">OpenAPI</a></div></div><div className="p-6 md:p-10"><h2 className="flex items-center gap-2 text-xl"><Braces className="size-5" /> REST submission</h2><p className="mt-3 text-sm text-muted-foreground">POST JSON to the shared submission service.</p><pre className="mt-6 overflow-x-auto bg-muted p-4 text-sm"><code>POST {publicOrigin}/api/v1/submissions</code></pre><p className="mt-5 text-sm text-muted-foreground">A successful request returns a stable ID, human-readable status URL, machine-readable API URL, and the current review state.</p></div></section><section className="border-b p-6 md:p-10"><h2 className="text-2xl">Available MCP tools</h2><div className="mt-6 grid gap-px bg-border p-px md:grid-cols-2">{tools.map(([name, description]) => <Card key={name} className="rounded-none ring-0"><CardHeader><CardTitle className="font-mono text-base">{name}</CardTitle><CardDescription>{description}</CardDescription></CardHeader></Card>)}</div></section><section className="grid border-b lg:grid-cols-[1.15fr_.85fr]"><div className="border-b p-6 lg:border-b-0 lg:border-r md:p-10"><h2 className="flex items-center gap-2 text-2xl"><FileJson2 className="size-5" /> Submission example</h2><pre className="mt-6 overflow-x-auto bg-muted p-5 text-xs leading-6 md:text-sm"><code>{submission}</code></pre></div><div className="p-6 md:p-10"><h2 className="text-2xl">Lifecycle</h2><ol className="mt-7 space-y-6">{[[CheckCircle2,"Validate","Required fields and HTTPS URL format are checked."],[Copy,"Submit","A persistent submission ID is issued."],[Search,"Review","A person checks the live project against the review policy."],[CheckCircle2,"Publish","Approved projects become publicly searchable."]].map(([Icon,title,description], index) => { const ItemIcon = Icon as typeof CheckCircle2; return <li key={String(title)} className="flex gap-4"><span className="flex size-8 shrink-0 items-center justify-center border text-xs">{index + 1}</span><div><p className="flex items-center gap-2 font-medium"><ItemIcon className="size-4" />{String(title)}</p><p className="mt-1 text-sm text-muted-foreground">{String(description)}</p></div></li>; })}</ol><a href="/review-policy" className="mt-8 inline-block text-sm underline underline-offset-4">Read the review policy</a></div></section></main></div>;
}
