import { NextResponse } from "next/server";
import { categories, PROTOCOL_VERSION } from "@/lib/protocol";

export function GET() {
  return NextResponse.json({ version: PROTOCOL_VERSION, categories });
}
