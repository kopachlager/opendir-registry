import { NextResponse } from "next/server";
import { submitProject } from "@/lib/submission-service";
import { listRecentSubmissions } from "@/lib/submissions";
import { serializeSubmission } from "@/lib/submission-service";
import { getPublicOrigin } from "@/lib/request-origin";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = await submitProject(body);
  return NextResponse.json(result.body, { status: result.status });
}

export async function GET(request: Request) {
  const origin = getPublicOrigin(request);
  const limit = Number.parseInt(new URL(request.url).searchParams.get("limit") ?? "20", 10);
  const submissions = await listRecentSubmissions(Number.isFinite(limit) ? limit : 20);
  return NextResponse.json({
    operation: "submit_project",
    method: "POST",
    endpoint: `${origin}/api/v1/submissions`,
    schema: `${origin}/api/v1/schema`,
    status_template: `${origin}/api/v1/submissions/{submission_id}`,
    submissions: submissions.map(serializeSubmission),
  });
}
