import { NextResponse } from "next/server";
import { searchProjects } from "@/lib/submissions";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const page = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
  const pageSize = Number.parseInt(url.searchParams.get("page_size") ?? "10", 10);
  const result = await searchProjects({
    query: url.searchParams.get("query") ?? undefined,
    category: url.searchParams.get("category") ?? undefined,
    page: Number.isFinite(page) ? page : 1,
    pageSize: Number.isFinite(pageSize) ? pageSize : 10,
  });
  return NextResponse.json(result);
}
