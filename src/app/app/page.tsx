import Link from "next/link";
import { Activity, Bot, CalendarDays, FolderOpen, RefreshCcw, ShieldCheck } from "lucide-react";
import { DashboardCard } from "@/components/dashboard-card";
import { DirectoryTable } from "@/components/directory-table";
import { SiteHeader } from "@/components/site-header";
import { UpdateBanner } from "@/components/update-banner";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const stats = [
  ["Published projects", "1,284", "+18%", FolderOpen],
  ["Agent submissions", "312", "+24%", Bot],
  ["Validation pass rate", "96.8%", "+4%", Activity],
];

export default function DirectoryPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main className="mx-auto max-w-7xl px-4 py-8 sm:px-6"><div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><h1 className="text-2xl tracking-tight">Directory overview</h1><p className="mt-1 text-sm text-muted-foreground">Monitor projects submitted by agents and builders.</p></div><div className="flex flex-wrap items-center gap-2"><Button variant="outline" size="icon-lg" aria-label="Refresh directory"><RefreshCcw /></Button><Button variant="outline" size="lg"><CalendarDays /> Last 30 days</Button><Link href="/submit" className={cn(buttonVariants({ size: "lg" }))}>Submit project</Link></div></div><div className="grid grid-cols-12 gap-px bg-border p-px"><div className="col-span-12"><UpdateBanner /></div>{stats.map(([label, value, change, Icon]) => <div key={String(label)} className="col-span-12 md:col-span-4"><DashboardCard className="py-6"><CardContent className="flex flex-col gap-4 px-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{String(label)}</p><div className="mt-1 flex items-center gap-2"><h2 className="text-2xl font-semibold">{String(value)}</h2><Badge variant="outline">{String(change)}</Badge></div></div><div className="rounded-md border p-2.5"><Icon className="size-4" /></div></div><Link href="#submissions" className={cn(buttonVariants({ variant: "outline" }), "w-fit")}>View details</Link></CardContent></DashboardCard></div>)}<div id="submissions" className="col-span-12"><DirectoryTable /></div><div className="col-span-12"><DashboardCard className="gap-0"><CardHeader className="border-b py-4"><CardTitle className="flex items-center gap-2"><ShieldCheck className="size-4" />Protocol status</CardTitle><CardDescription>Public submission contract and available capabilities.</CardDescription></CardHeader><CardContent className="grid gap-4 py-4 sm:grid-cols-2 lg:grid-cols-4"><div><p className="text-sm text-muted-foreground">Endpoint</p><Badge className="mt-2" variant="secondary">Online</Badge></div><div><p className="text-sm text-muted-foreground">Version</p><p className="mt-2 font-mono text-sm">0.1</p></div><div><p className="text-sm text-muted-foreground">Review policy</p><p className="mt-2 text-sm">Open with review</p></div><div><p className="text-sm text-muted-foreground">Capabilities</p><p className="mt-2 text-sm">Submit · Validate · Status</p></div></CardContent></DashboardCard></div></div></main></div>;
}
