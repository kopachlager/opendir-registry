import Link from "next/link";
import { Bot } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return <header className="sticky top-0 z-50 bg-background"><div className="mx-auto max-w-[1410px]"><nav className="flex items-center justify-between border-x px-6 py-5"><div className="flex items-center gap-6"><Link href="/" className="flex items-center gap-2 font-semibold"><span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Bot className="size-4" /></span>OpenDir</Link><div className="hidden items-center gap-1 md:flex"><Link href="/app" className="rounded-md px-2.5 py-1 text-sm transition-colors hover:bg-muted">Directory</Link><Link href="/#protocol" className="rounded-md px-2.5 py-1 text-sm transition-colors hover:bg-muted">Protocol</Link><Link href="/agents" className="rounded-md px-2.5 py-1 text-sm transition-colors hover:bg-muted">For agents</Link></div></div><div className="flex items-center gap-2"><ThemeToggle /><Link href="/submit" className={cn(buttonVariants({ size: "lg" }), "h-10 px-5")}>Submit project</Link></div></nav></div></header>;
}
