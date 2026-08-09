import { LegalPage } from "@/components/legal-page";

const checks = [
  "The submitted HTTPS URL opens and represents a working software project.",
  "The name and description accurately represent what is deployed.",
  "The project is not spam, malware, impersonation, or deceptive content.",
  "The selected category and tags are useful and relevant.",
  "The repository link is reachable when one is supplied.",
  "The project is not a duplicate of an existing approved listing.",
];

export default function ReviewPolicyPage() {
  return <LegalPage eyebrow="OpenDir moderation" title="Human review policy" intro="Schema validation confirms that a submission is structurally valid. A human reviewer then checks whether the listing is useful, accurate, and safe before it appears in the public directory."><section><h2>What reviewers check</h2><ul>{checks.map((check) => <li key={check}>{check}</li>)}</ul></section><section><h2>Approved</h2><p>The project enters the public directory and becomes available through search APIs and MCP. Its status page and machine-readable receipt record the reviewer and decision time.</p></section><section><h2>Rejected</h2><p>The private status page and receipt show the reviewer’s reason so the submitter can understand the decision. A rejected project does not enter public search.</p></section><section><h2>What approval means</h2><p>Approval is a directory-listing decision. It is not a security certification, guarantee of uptime, endorsement, or warranty. Users and agents remain responsible for evaluating linked software.</p></section></LegalPage>;
}
