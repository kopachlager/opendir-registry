import { NextResponse } from "next/server";
import { PROTOCOL_VERSION } from "@/lib/protocol";
import { storageMode } from "@/lib/submissions";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "openshelf",
    protocol_version: PROTOCOL_VERSION,
    storage: storageMode(),
  });
}
