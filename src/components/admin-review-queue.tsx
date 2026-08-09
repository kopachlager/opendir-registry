"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, LogOut, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export type ReviewSubmission = {
  id: string;
  name: string;
  url: string;
  description: string;
  category: string;
  tags: string[];
  repository_url?: string;
  submitted_by: string;
  created_at: string;
};

export function AdminReviewQueue({ initialSubmissions }: { initialSubmissions: ReviewSubmission[] }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [reasons, setReasons] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  async function decide(id: string, decision: "published" | "rejected") {
    setBusy(id);
    setError("");
    const response = await fetch(`/api/admin/submissions/${id}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ decision, reason: reasons[id] || "" }),
    });
    const result = await response.json();
    if (!response.ok) setError(result.error || "Review action failed.");
    else setSubmissions((current) => current.filter((item) => item.id !== id));
    setBusy("");
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    window.location.reload();
  }

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div><h1 className="text-3xl tracking-tight">Review queue</h1><p className="mt-2 text-muted-foreground">Validate submitted projects before they enter the public directory.</p></div>
        <Button variant="outline" onClick={logout}><LogOut /> Sign out</Button>
      </div>
      {error && <p className="mb-4 border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive">{error}</p>}
      {submissions.length === 0 ? (
        <div className="border p-12 text-center"><CheckCircle2 className="mx-auto size-6" /><h2 className="mt-4 font-medium">Queue is clear</h2><p className="mt-1 text-sm text-muted-foreground">There are no projects awaiting review.</p></div>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission.id} className="rounded-none">
              <CardHeader className="border-b"><div className="flex flex-wrap items-start justify-between gap-3"><div><CardTitle>{submission.name}</CardTitle><p className="mt-1 font-mono text-xs text-muted-foreground">{submission.id} · {submission.submitted_by}</p></div><Badge variant="outline">{submission.category}</Badge></div></CardHeader>
              <CardContent className="grid gap-6 lg:grid-cols-[1fr_320px]">
                <div><p className="leading-7">{submission.description}</p><div className="mt-5 flex flex-wrap gap-2"><a href={submission.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm underline underline-offset-4">Live project <ArrowUpRight className="size-3.5" /></a>{submission.repository_url && <a href={submission.repository_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm underline underline-offset-4">Repository <ArrowUpRight className="size-3.5" /></a>}</div><div className="mt-4 flex flex-wrap gap-1">{submission.tags.map((tag) => <Badge key={tag} variant="secondary">{tag}</Badge>)}</div></div>
                <div className="space-y-3"><Textarea value={reasons[submission.id] || ""} onChange={(event) => setReasons((current) => ({ ...current, [submission.id]: event.target.value }))} placeholder="Review note or required rejection reason" /><div className="grid grid-cols-2 gap-2"><Button onClick={() => decide(submission.id, "published")} disabled={busy === submission.id}><CheckCircle2 /> Approve</Button><Button variant="outline" onClick={() => decide(submission.id, "rejected")} disabled={busy === submission.id}><XCircle /> Reject</Button></div></div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
