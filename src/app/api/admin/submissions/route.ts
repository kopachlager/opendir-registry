import { NextResponse } from "next/server";
import { isAdminSession } from "@/lib/admin-auth";
import { serializeSubmission } from "@/lib/submission-service";
import { listReviewSubmissions } from "@/lib/submissions";

export async function GET() {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }
  const submissions = await listReviewSubmissions();
  return NextResponse.json({ submissions: submissions.map(serializeSubmission) });
}
