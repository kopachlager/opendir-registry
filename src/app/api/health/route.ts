import { NextResponse } from "next/server";
import { PROTOCOL_VERSION, REGISTRY_VERSION } from "@/lib/protocol";
import { storageMode } from "@/lib/submissions";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "opendir-registry",
    protocol_version: PROTOCOL_VERSION,
    registry_version: REGISTRY_VERSION,
    storage: storageMode(),
  });
}
