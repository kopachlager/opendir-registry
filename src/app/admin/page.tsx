import type { Metadata } from "next";
import { AdminLogin } from "@/components/admin-login";
import { AdminReviewQueue } from "@/components/admin-review-queue";
import { SiteHeader } from "@/components/site-header";
import { isAdminConfigured, isAdminSession } from "@/lib/admin-auth";
import { serializeSubmission } from "@/lib/submission-service";
import { listReviewSubmissions } from "@/lib/submissions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AdminPage() {
  const authenticated = await isAdminSession();
  const submissions = authenticated ? await listReviewSubmissions() : [];
  return <div className="min-h-screen bg-background"><SiteHeader /><main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">{authenticated ? <AdminReviewQueue initialSubmissions={submissions.map(serializeSubmission)} /> : <AdminLogin configured={isAdminConfigured()} />}</main></div>;
}
