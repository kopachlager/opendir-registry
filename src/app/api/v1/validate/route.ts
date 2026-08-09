import { NextResponse } from "next/server";
import { validateSubmission } from "@/lib/protocol";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const result = validateSubmission(body);
  return NextResponse.json(result, { status: result.valid ? 200 : 400 });
}
