import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    name: "OpenShelf",
    protocol: "openshelf-submission",
    version: "0.1",
    description: "An agent-first directory for deployed software projects.",
    capabilities: ["submit_project", "validate_project", "get_submission_status"],
    submission_endpoint: "/api/submissions",
    required_fields: ["name", "url", "description", "category", "submitted_by"],
    review_policy: "open-with-review",
  });
}
