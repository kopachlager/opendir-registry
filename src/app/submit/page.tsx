"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { categories } from "@/lib/protocol";

type SubmissionReceipt = {
  submissionId: string;
  status: string;
  statusUrl: string;
};

export default function SubmitPage() {
  const [receipt, setReceipt] = useState<SubmissionReceipt | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    const form = new FormData(event.currentTarget);
    const tags = String(form.get("tags") ?? "")
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      const response = await fetch("/api/v1/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          url: form.get("url"),
          description: form.get("description"),
          category: form.get("category"),
          tags,
          repository_url: form.get("repository_url"),
          submitted_by: { type: "human", name: "web-form" },
        }),
      });
      const result = await response.json();
      if (!response.ok) {
        const firstIssue = result.details?.[0]?.message;
        setError(firstIssue ? `${result.error} ${firstIssue}` : result.error);
        return;
      }
      setReceipt({
        submissionId: result.submission_id,
        status: result.status,
        statusUrl: result.status_url,
      });
    } catch {
      setError("The submission service could not be reached.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <SiteHeader />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <div className="mb-6">
          <h1 className="text-3xl tracking-tight">Submit a project</h1>
          <p className="mt-2 text-muted-foreground">
            This form uses the same ODSS v0.1 contract exposed to agents.
          </p>
        </div>
        <Card>
          {receipt ? (
            <CardContent className="py-8">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 size-5" />
                <div>
                  <h2 className="font-semibold">Submission received</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    The project is in the {receipt.status} queue.
                  </p>
                  <div className="mt-5 border bg-muted/40 p-4 text-sm">
                    <p className="text-muted-foreground">Submission ID</p>
                    <p className="mt-1 font-mono">{receipt.submissionId}</p>
                    <a
                      href={receipt.statusUrl}
                      className="mt-3 inline-block underline underline-offset-4"
                    >
                      View machine-readable status
                    </a>
                  </div>
                  <Button
                    className="mt-5"
                    variant="outline"
                    onClick={() => setReceipt(null)}
                  >
                    Submit another
                  </Button>
                </div>
              </div>
            </CardContent>
          ) : (
            <>
              <CardHeader className="border-b pb-4">
                <CardTitle>Project details</CardTitle>
                <CardDescription>
                  Required fields follow the public submission JSON Schema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={submit} className="space-y-5">
                  <label className="grid gap-2 text-sm font-medium">
                    Project name
                    <Input required name="name" minLength={2} maxLength={100} placeholder="My project" />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Live URL
                    <Input required name="url" type="url" placeholder="https://example.com" />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Repository URL <span className="text-muted-foreground">Optional</span>
                    <Input name="repository_url" type="url" placeholder="https://github.com/org/project" />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Category
                    <select
                      required
                      name="category"
                      defaultValue=""
                      className="h-9 w-full border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Tags <span className="text-muted-foreground">Optional, comma separated</span>
                    <Input name="tags" placeholder="mcp, automation, open-source" />
                  </label>
                  <label className="grid gap-2 text-sm font-medium">
                    Description
                    <Textarea
                      required
                      name="description"
                      minLength={20}
                      maxLength={1_000}
                      placeholder="Explain what the project does and who it helps."
                    />
                  </label>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <div className="flex justify-end">
                    <Button type="submit" size="lg" disabled={submitting}>
                      {submitting ? "Submitting…" : "Send submission"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </>
          )}
        </Card>
      </main>
    </div>
  );
}
