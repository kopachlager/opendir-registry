export type ProjectListing = {
  id: string;
  name: string;
  url: string;
  description: string;
  category: "AI & Agents" | "Developer Tools" | "Data" | "Infrastructure" | "Productivity" | "Open Source";
  submittedBy: string;
  status: "Approved";
  updated: string;
  tags: string[];
};
