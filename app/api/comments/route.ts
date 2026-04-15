import { NextRequest, NextResponse } from "next/server";
import { getComments, getAllComments, createComment, approveComment, deleteComment } from "@/lib/store";
import { isAdminRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const isAdmin = await isAdminRequest(req);
  const postId = req.nextUrl.searchParams.get("postId");

  if (postId) {
    const comments = getComments(postId, !isAdmin);
    return NextResponse.json(comments);
  }

  // Admin: get all comments
  if (isAdmin) {
    return NextResponse.json(getAllComments());
  }

  return NextResponse.json({ error: "postId required" }, { status: 400 });
}

export async function POST(req: NextRequest) {
  const data = await req.json();
  const { postId, name, email, message } = data;

  if (!postId || !name || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Basic spam check
  if (message.length < 3 || message.length > 2000) {
    return NextResponse.json({ error: "Invalid message length" }, { status: 400 });
  }

  const comment = createComment({ postId, name, email: email || "", message });
  return NextResponse.json({ success: true, comment }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  approveComment(id);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await isAdminRequest(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await req.json();
  deleteComment(id);
  return NextResponse.json({ success: true });
}
