import { NextRequest, NextResponse } from "next/server";
import { getPostById, updatePost, deletePost, incrementViews, getPost } from "@/lib/store";
import { isAdminRequest } from "@/lib/auth";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  // Try by ID first, then by slug
  const post = getPostById(params.id) || getPost(params.id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  incrementViews(post.slug);
  return NextResponse.json(post);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const post = updatePost(params.id, data);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(post);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const ok = deletePost(params.id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
