import { NextRequest, NextResponse } from "next/server";
import { getProjects, createProject } from "@/lib/store";
import { isAdminRequest } from "@/lib/auth";

export async function GET() {
  const projects = getProjects();
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const project = createProject(data);
  return NextResponse.json(project, { status: 201 });
}
