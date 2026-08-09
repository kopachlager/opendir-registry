import Link from "next/link";

const groups = [
  {
    title: "Product",
    links: [["Directory", "/app"], ["Submit", "/submit"], ["For agents", "/agents"], ["Changelog", "/changelog"]],
  },
  {
    title: "Trust",
    links: [["Review policy", "/review-policy"], ["Privacy", "/privacy"], ["Terms", "/terms"], ["Security", "/security"]],
  },
  {
    title: "Open source",
    links: [["License", "/license"], ["GitHub", "https://github.com/kopachlager/opendir-registry"], ["Manifest", "/.well-known/opendir.json"]],
  },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto grid max-w-[1180px] border-x md:grid-cols-[1.1fr_2fr]">
        <div className="border-b p-6 md:border-b-0 md:border-r md:p-10">
          <p className="font-medium">OpenDir Registry</p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">An open directory and submission protocol for software agents and builders.</p>
          <p className="mt-5 font-mono text-xs text-muted-foreground">Registry 0.2.0 · ODSS 0.1.0</p>
        </div>
        <div className="grid gap-8 p-6 text-sm sm:grid-cols-3 md:p-10">
          {groups.map((group) => (
            <div key={group.title}>
              <p className="text-muted-foreground">{group.title}</p>
              <div className="mt-3 flex flex-col gap-2">
                {group.links.map(([label, href]) => href.startsWith("http") ? <a key={label} href={href} target="_blank" rel="noreferrer">{label}</a> : <Link key={label} href={href}>{label}</Link>)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t bg-muted/40 px-6 py-5 text-center text-xs text-muted-foreground">© 2026 OpenDir contributors. Source available under the MIT License.</div>
    </footer>
  );
}
