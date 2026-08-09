import { NextResponse } from "next/server";
import { submissionJsonSchema } from "@/lib/protocol";

export function GET() {
  return NextResponse.json(submissionJsonSchema, {
    headers: { "Cache-Control": "public, max-age=3600" },
  });
}
