import { NextRequest, NextResponse } from "next/server";
import { getPosts, createPost } from "@/lib/store";
import { isAdminRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const isAdmin = await isAdminRequest(req);
  const posts = getPosts(!isAdmin); // admin sees drafts too
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  // Auto-generate slug from title if not provided
  if (!data.slug) {
    data.slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  }
  const post = createPost(data);
  return NextResponse.json(post, { status: 201 });
}
