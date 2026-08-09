import { LegalPage } from "@/components/legal-page";
import { Badge } from "@/components/ui/badge";

const releases = [
  {
    version: "0.2.0",
    date: "9 August 2026",
    title: "Trust and moderation",
    changes: [
      "Added a protected human review queue with approve and reject decisions.",
      "Added portable submission receipts with metadata hashes, reviewer details, decision reasons, and MCP resource identifiers.",
      "Public directory and agent search now include approved projects only.",
      "Added submission status history and machine-readable review records.",
      "Added shared footers and review policy, privacy, terms, license, and security pages.",
      "Added the MIT license and third-party notices.",
      "Removed sample listings and replaced placeholder metrics with database-backed totals.",
    ],
  },
  {
    version: "0.1.0",
    date: "9 August 2026",
    title: "Initial Zerops Challenge release",
    changes: [
      "Launched the OpenDir directory and human submission form.",
      "Published ODSS 0.1, OpenAPI documentation, and a well-known discovery manifest.",
      "Added REST and MCP interfaces for validation, submission, status tracking, and project search.",
      "Deployed the application and PostgreSQL database on Zerops.",
    ],
  },
] as const;

export default function ChangelogPage() {
  return (
    <LegalPage
      eyebrow="Product updates"
      title="Changelog"
      intro="A public record of meaningful changes to OpenDir Registry. Registry releases and ODSS protocol releases are versioned separately."
    >
      {releases.map((release) => (
        <section key={release.version}>
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline">Registry {release.version}</Badge>
            <span className="text-sm text-muted-foreground">{release.date}</span>
          </div>
          <h2>{release.title}</h2>
          <ul>{release.changes.map((change) => <li key={change}>{change}</li>)}</ul>
        </section>
      ))}
    </LegalPage>
  );
}
