import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock3, ExternalLink, FileCheck2, XCircle } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getSubmission, getSubmissionEvents } from "@/lib/submissions";
import { serializeSubmissionReceipt } from "@/lib/submission-service";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const labels = {
  received: "Received",
  validating: "Validating",
  review: "Awaiting human review",
  published: "Published",
  rejected: "Rejected",
} as const;

export default async function SubmissionStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [submission, events] = await Promise.all([getSubmission(id), getSubmissionEvents(id)]);
  if (!submission) notFound();
  const receipt = serializeSubmissionReceipt(submission);
  const Icon = submission.status === "published" ? CheckCircle2 : submission.status === "rejected" ? XCircle : Clock3;
  return <div className="min-h-screen bg-background"><SiteHeader /><main className="mx-auto max-w-4xl px-4 py-10 sm:px-6"><div className="border"><div className="border-b p-6 md:p-8"><Badge variant="outline"><Icon /> {labels[submission.status]}</Badge><h1 className="mt-5 text-3xl tracking-tight">{submission.name}</h1><p className="mt-2 font-mono text-xs text-muted-foreground">{submission.id}</p></div><div className="grid md:grid-cols-[1fr_280px]"><section className="border-b p-6 md:border-b-0 md:border-r md:p-8"><h2 className="font-medium">Submission status</h2><p className="mt-3 leading-7 text-muted-foreground">{submission.status === "review" && "The metadata passed schema validation and is waiting for a reviewer to check the live project."}{submission.status === "published" && "The project was approved and is now searchable in the public OpenDir directory."}{submission.status === "rejected" && "The project was not approved in its current form."}</p>{submission.reviewReason && <div className="mt-5 border bg-muted/30 p-4"><p className="text-sm font-medium">Reviewer note</p><p className="mt-2 text-sm text-muted-foreground">{submission.reviewReason}</p></div>}<div className="mt-7"><a href={submission.url} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "outline" }))}>Open submitted project <ExternalLink /></a></div></section><aside className="divide-y"><div className="p-6"><p className="text-sm text-muted-foreground">Submitted by</p><p className="mt-2 font-mono text-sm">{submission.submittedBy}</p></div><div className="p-6"><p className="text-sm text-muted-foreground">Category</p><p className="mt-2 text-sm">{submission.category}</p></div><div className="p-6"><p className="text-sm text-muted-foreground">Last updated</p><p className="mt-2 text-sm">{new Date(submission.updatedAt).toLocaleString()}</p></div></aside></div><section className="border-t p-6 md:p-8"><h2 className="font-medium">Submission receipt</h2><dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-muted-foreground">Metadata hash</dt><dd className="mt-1 break-all font-mono text-xs">{receipt.metadata_hash}</dd></div><div><dt className="text-muted-foreground">Validator</dt><dd className="mt-1 font-mono text-xs">{receipt.validator_version}</dd></div><div><dt className="text-muted-foreground">MCP resource</dt><dd className="mt-1 break-all font-mono text-xs">{receipt.mcp_resource_uri}</dd></div><div><dt className="text-muted-foreground">Reviewer</dt><dd className="mt-1 text-xs">{receipt.reviewer || "Pending"}</dd></div></dl></section><section className="border-t p-6 md:p-8"><h2 className="flex items-center gap-2 font-medium"><FileCheck2 className="size-4" /> Event history</h2><div className="mt-5 space-y-5">{events.map((event, index) => <div key={`${event.createdAt}-${index}`} className="border-l-2 pl-4"><p className="text-sm font-medium capitalize">{event.eventType}</p><p className="mt-1 text-xs text-muted-foreground">{new Date(event.createdAt).toLocaleString()}</p></div>)}</div><Link href={`/api/v1/submissions/${submission.id}`} className="mt-7 inline-block text-sm underline underline-offset-4">View machine-readable record</Link></section></div></main></div>;
}
