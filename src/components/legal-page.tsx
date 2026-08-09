import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";

export function LegalPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-3xl border-x px-6 py-14 md:px-10 md:py-20">
        <p className="text-sm text-muted-foreground">{eyebrow}</p>
        <h1 className="mt-3 text-4xl tracking-tight">{title}</h1>
        <p className="mt-5 text-lg leading-8 text-muted-foreground">{intro}</p>
        <div className="mt-12 space-y-10 text-sm leading-7 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-medium [&_li]:ml-5 [&_li]:list-disc [&_p+p]:mt-3">{children}</div>
        <p className="mt-14 border-t pt-6 text-xs text-muted-foreground">Effective 9 August 2026 · OpenDir Registry 0.2.0</p>
      </main>
    </div>
  );
}
