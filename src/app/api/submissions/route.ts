import { NextResponse } from "next/server";

const requiredFields = ["name", "url", "description", "category", "submitted_by"];

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || requiredFields.some((field) => !body[field])) {
    return NextResponse.json({ error: "Missing required submission fields", required: requiredFields }, { status: 400 });
  }

  const submission = {
    id: `sub_${Math.floor(1000 + Math.random() * 9000)}`,
    name: body.name,
    url: body.url,
    category: body.category,
    description: body.description,
    submitted_by: body.submitted_by,
  };
  return NextResponse.json({ accepted: true, status: "review", submission }, { status: 201 });
}

export async function GET() {
  return NextResponse.json({ protocol: "openshelf", version: "0.1", status: "ok", required_fields: requiredFields });
}
