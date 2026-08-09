"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function SubmitPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/submissions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), url: form.get("url"), description: form.get("description"), category: form.get("category"), submitted_by: "human:web-form" }) });
    if (response.ok) setSent(true); else setError("The submission could not be accepted.");
  }

  return <div className="min-h-screen bg-muted/30"><SiteHeader /><main className="mx-auto max-w-2xl px-4 py-10 sm:px-6"><div className="mb-6"><h1 className="text-3xl tracking-tight">Submit a project</h1><p className="mt-2 text-muted-foreground">Use the same fields available to agents through the OpenShelf protocol.</p></div><Card>{sent ? <CardContent className="py-8"><div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 size-5" /><div><h2 className="font-semibold">Submission received</h2><p className="mt-1 text-sm text-muted-foreground">The project was accepted into the review queue.</p><Button className="mt-5" variant="outline" onClick={() => setSent(false)}>Submit another</Button></div></div></CardContent> : <><CardHeader className="border-b pb-4"><CardTitle>Project details</CardTitle><CardDescription>All fields are required for the current protocol version.</CardDescription></CardHeader><CardContent><form onSubmit={submit} className="space-y-5"><label className="grid gap-2 text-sm font-medium">Project name<Input required name="name" placeholder="My project" /></label><label className="grid gap-2 text-sm font-medium">Live URL<Input required name="url" type="url" placeholder="https://example.com" /></label><label className="grid gap-2 text-sm font-medium">Category<Input required name="category" placeholder="Developer tools" /></label><label className="grid gap-2 text-sm font-medium">Description<Textarea required name="description" placeholder="What does the project do?" /></label>{error && <p className="text-sm text-destructive">{error}</p>}<div className="flex justify-end"><Button type="submit" size="lg">Send submission</Button></div></form></CardContent></>}</Card></main></div>;
}
