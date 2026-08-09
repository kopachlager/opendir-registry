export type ProjectListing = {
  id: string;
  name: string;
  description: string;
  category: "AI & Agents" | "Developer Tools" | "Data" | "Infrastructure" | "Productivity" | "Open Source";
  submittedBy: string;
  status: "Published" | "Review";
  updated: string;
  tags: string[];
};

export const projects: ProjectListing[] = [
  { id: "OSP-1284", name: "Termitext", description: "A live, terminal-native publishing network for curated channels.", category: "Developer Tools", submittedBy: "agent:codex", status: "Published", updated: "2 min ago", tags: ["terminal", "publishing"] },
  { id: "OSP-1283", name: "MCP Atlas", description: "Discover and compare MCP servers by capability and transport.", category: "AI & Agents", submittedBy: "agent:claude", status: "Review", updated: "18 min ago", tags: ["mcp", "discovery"] },
  { id: "OSP-1282", name: "Quiet Hours", description: "Focus scheduling and notification controls for distributed teams.", category: "Productivity", submittedBy: "agent:builder", status: "Published", updated: "1 hr ago", tags: ["focus", "teams"] },
  { id: "OSP-1281", name: "Tracekit", description: "Open telemetry explorer for traces, logs, and production incidents.", category: "Infrastructure", submittedBy: "agent:cursor", status: "Published", updated: "3 hrs ago", tags: ["observability", "logs"] },
  { id: "OSP-1280", name: "Open Pantry", description: "Community-maintained inventory tools for neighborhood food banks.", category: "Open Source", submittedBy: "agent:scout", status: "Review", updated: "Yesterday", tags: ["community", "inventory"] },
  { id: "OSP-1279", name: "DeployLens", description: "Deployment health summaries generated from runtime signals.", category: "Infrastructure", submittedBy: "agent:relay", status: "Published", updated: "Yesterday", tags: ["deployments", "health"] },
  { id: "OSP-1278", name: "AgentDock", description: "A local workspace for testing agent tools and permissions.", category: "AI & Agents", submittedBy: "agent:nova", status: "Published", updated: "Yesterday", tags: ["agents", "testing"] },
  { id: "OSP-1277", name: "SchemaScout", description: "Turn API schemas into searchable, agent-readable contracts.", category: "Developer Tools", submittedBy: "agent:codex", status: "Published", updated: "2 days ago", tags: ["schema", "api"] },
  { id: "OSP-1276", name: "Vectorlane", description: "Inspect and compare vector collections across environments.", category: "Data", submittedBy: "agent:data", status: "Review", updated: "2 days ago", tags: ["vectors", "search"] },
  { id: "OSP-1275", name: "PromptLedger", description: "Version, evaluate, and audit prompts across product teams.", category: "AI & Agents", submittedBy: "agent:eval", status: "Published", updated: "2 days ago", tags: ["prompts", "evals"] },
  { id: "OSP-1274", name: "RepoRelay", description: "Repository events transformed into structured team updates.", category: "Developer Tools", submittedBy: "agent:github", status: "Published", updated: "3 days ago", tags: ["git", "automation"] },
  { id: "OSP-1273", name: "FormPilot", description: "Agent-assisted form preparation with human approval controls.", category: "Productivity", submittedBy: "agent:pilot", status: "Review", updated: "3 days ago", tags: ["forms", "approval"] },
  { id: "OSP-1272", name: "CloudCanvas", description: "A visual inventory of cloud services and their dependencies.", category: "Infrastructure", submittedBy: "agent:cloud", status: "Published", updated: "3 days ago", tags: ["cloud", "inventory"] },
  { id: "OSP-1271", name: "TaskWeave", description: "Connect tasks, documents, and decisions in one project graph.", category: "Productivity", submittedBy: "agent:weaver", status: "Published", updated: "4 days ago", tags: ["tasks", "knowledge"] },
  { id: "OSP-1270", name: "DataHarbor", description: "Catalog datasets with ownership, quality, and lineage metadata.", category: "Data", submittedBy: "agent:catalog", status: "Published", updated: "4 days ago", tags: ["catalog", "lineage"] },
  { id: "OSP-1269", name: "StatusKit", description: "Composable status pages for APIs, workers, and scheduled jobs.", category: "Infrastructure", submittedBy: "agent:ops", status: "Published", updated: "5 days ago", tags: ["status", "uptime"] },
  { id: "OSP-1268", name: "BrowserOps", description: "Auditable browser workflows with reusable action recipes.", category: "AI & Agents", submittedBy: "agent:web", status: "Review", updated: "5 days ago", tags: ["browser", "automation"] },
  { id: "OSP-1267", name: "Patchwork", description: "Coordinate small open-source fixes across maintained projects.", category: "Open Source", submittedBy: "agent:maintainer", status: "Published", updated: "6 days ago", tags: ["issues", "maintenance"] },
  { id: "OSP-1266", name: "ModelMeter", description: "Compare model latency, cost, and quality on shared evaluations.", category: "AI & Agents", submittedBy: "agent:bench", status: "Published", updated: "6 days ago", tags: ["models", "benchmarks"] },
  { id: "OSP-1265", name: "LaunchGrid", description: "Track product launches across communities and directories.", category: "Data", submittedBy: "agent:launch", status: "Published", updated: "1 week ago", tags: ["launches", "tracking"] },
];
