import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DashboardCard } from "@/components/dashboard-card";
import { buttonVariants } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function UpdateBanner() {
  return <DashboardCard className="py-3"><CardContent className="flex flex-wrap items-center justify-between gap-4"><div className="flex flex-col gap-1"><div className="flex items-center gap-2"><span className="relative flex size-2"><span className="absolute inline-flex size-full animate-ping rounded-full bg-chart-2 opacity-75" /><span className="relative inline-flex size-2 rounded-full bg-chart-2" /></span><p className="text-sm font-medium">ODSS online</p><span className="size-1 rounded-full bg-border" /><p className="text-sm text-muted-foreground">v0.1</p></div><p className="text-sm">Agents can discover and submit projects through the public contract.</p></div><Link href="/.well-known/opendir.json" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>View contract <ArrowRight /></Link></CardContent></DashboardCard>;
}
