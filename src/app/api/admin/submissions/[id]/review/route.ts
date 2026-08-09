import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { serializeSubmission } from "@/lib/submission-service";
import { reviewSubmission } from "@/lib/submissions";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  const decision = body?.decision;
  const reason = typeof body?.reason === "string" ? body.reason.trim() : "";
  if (decision !== "published" && decision !== "rejected") {
    return NextResponse.json({ error: "Invalid review decision." }, { status: 400 });
  }
  if (decision === "rejected" && reason.length < 3) {
    return NextResponse.json(
      { error: "A rejection reason is required." },
      { status: 400 },
    );
  }
  const { id } = await params;
  const submission = await reviewSubmission({
    id,
    decision,
    reason: reason || undefined,
    reviewer: process.env.ADMIN_REVIEWER_NAME?.trim() || "OpenDir reviewer",
  });
  if (!submission) {
    return NextResponse.json(
      { error: "Submission is missing or has already been reviewed." },
      { status: 409 },
    );
  }
  return NextResponse.json({ submission: serializeSubmission(submission) });
}
