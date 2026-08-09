import Link from "next/link";
import { Bot } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  return <header className="border-b"><div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6"><Link href="/" className="flex items-center gap-2 font-semibold"><span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground"><Bot className="size-4" /></span>OpenShelf</Link><nav className="ml-10 hidden items-center gap-6 text-sm text-muted-foreground md:flex"><Link href="/app" className="hover:text-foreground">Directory</Link><Link href="/#protocol" className="hover:text-foreground">Protocol</Link><Link href="/.well-known/openshelf.json" className="hover:text-foreground">For agents</Link></nav><div className="ml-auto flex items-center gap-2"><ThemeToggle /><Link href="/submit" className={cn(buttonVariants({ size: "lg" }))}>Submit project</Link></div></div></header>;
}
