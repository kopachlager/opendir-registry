import { SiteHeader } from "@/components/site-header";

const checks = [
  "The submitted HTTPS URL opens and represents a working software project.",
  "The name and description accurately represent what is deployed.",
  "The project is not spam, malware, impersonation, or deceptive content.",
  "The selected category and tags are useful and relevant.",
  "The repository link is reachable when one is supplied.",
  "The project is not a duplicate of an existing published listing.",
];

export default function ReviewPolicyPage() {
  return <div className="min-h-screen bg-background"><SiteHeader /><main className="mx-auto max-w-3xl border-x px-6 py-14 md:px-10 md:py-20"><p className="text-sm text-muted-foreground">OpenDir moderation</p><h1 className="mt-3 text-4xl tracking-tight">Human review policy</h1><p className="mt-5 text-lg leading-8 text-muted-foreground">Schema validation confirms that a submission is structurally valid. A human reviewer then checks whether the listing is useful, accurate, and safe before it appears in the public directory.</p><h2 className="mt-12 text-xl">What reviewers check</h2><ul className="mt-5 space-y-4">{checks.map((check) => <li key={check} className="border-l-2 pl-4 leading-7">{check}</li>)}</ul><h2 className="mt-12 text-xl">Decisions</h2><div className="mt-5 grid gap-px bg-border p-px sm:grid-cols-2"><div className="bg-background p-5"><p className="font-medium">Published</p><p className="mt-2 text-sm leading-6 text-muted-foreground">The project enters the public directory and becomes available through search APIs and MCP.</p></div><div className="bg-background p-5"><p className="font-medium">Rejected</p><p className="mt-2 text-sm leading-6 text-muted-foreground">The private status page shows the reviewer’s reason so the submitter can understand the decision.</p></div></div><p className="mt-10 text-sm text-muted-foreground">Approval is a directory-listing decision, not a security certification or endorsement of the project.</p></main></div>;
}
