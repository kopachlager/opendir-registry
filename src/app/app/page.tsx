import Link from "next/link";
import { Bot, Clock3, FolderOpen, ShieldCheck } from "lucide-react";
import { DashboardCard } from "@/components/dashboard-card";
import { DirectoryTable } from "@/components/directory-table";
import { SiteHeader } from "@/components/site-header";
import { UpdateBanner } from "@/components/update-banner";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDirectoryStats } from "@/lib/submissions";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DirectoryPage() {
  const counts = await getDirectoryStats();
  const stats = [
    ["Published projects", counts.published, FolderOpen],
    ["Total submissions", counts.submissions, Bot],
    ["Awaiting review", counts.awaitingReview, Clock3],
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl tracking-tight">Directory overview</h1>
            <p className="mt-1 text-sm text-muted-foreground">Browse projects approved by OpenDir reviewers.</p>
          </div>
          <Link href="/submit" className={cn(buttonVariants({ size: "lg" }))}>Submit project</Link>
        </div>
        <div className="grid grid-cols-12 gap-px bg-border p-px">
          <div className="col-span-12"><UpdateBanner /></div>
          {stats.map(([label, value, Icon]) => (
            <div key={label} className="col-span-12 md:col-span-4">
              <DashboardCard className="py-6"><CardContent className="flex items-center justify-between px-6"><div><p className="text-sm text-muted-foreground">{label}</p><h2 className="mt-1 text-2xl font-semibold">{value}</h2></div><div className="border p-2.5"><Icon className="size-4" /></div></CardContent></DashboardCard>
            </div>
          ))}
          <div id="submissions" className="col-span-12"><DirectoryTable /></div>
          <div className="col-span-12">
            <DashboardCard className="gap-0"><CardHeader className="border-b py-4"><CardTitle className="flex items-center gap-2"><ShieldCheck className="size-4" />Protocol status</CardTitle><CardDescription>Public submission contract and available capabilities.</CardDescription></CardHeader><CardContent className="grid gap-4 py-4 sm:grid-cols-2 lg:grid-cols-4"><div><p className="text-sm text-muted-foreground">Endpoint</p><Badge className="mt-2" variant="secondary">Online</Badge></div><div><p className="text-sm text-muted-foreground">Version</p><p className="mt-2 font-mono text-sm">0.1</p></div><div><p className="text-sm text-muted-foreground">Review policy</p><Link href="/review-policy" className="mt-2 block text-sm underline underline-offset-4">Human review</Link></div><div><p className="text-sm text-muted-foreground">Capabilities</p><p className="mt-2 text-sm">Submit · Validate · Status · Search</p></div></CardContent></DashboardCard>
          </div>
        </div>
      </main>
    </div>
  );
}
