import { NextResponse } from "next/server";
import { serializeSubmission } from "@/lib/submission-service";
import { getSubmission } from "@/lib/submissions";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const submission = await getSubmission(id);
  if (!submission) {
    return NextResponse.json(
      { error: "Submission not found.", code: "NOT_FOUND" },
      { status: 404 },
    );
  }
  return NextResponse.json({ submission: serializeSubmission(submission) });
}
