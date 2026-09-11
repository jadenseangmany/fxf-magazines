import { addComment, getComments } from "@/lib/comments";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "missing slug" }, { status: 400 });
  }
  const comments = await getComments(slug);
  return NextResponse.json(comments);
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    slug?: string;
    name?: string;
    message?: string;
    parentId?: string | null;
  };
  if (!body.slug || !body.name?.trim() || !body.message?.trim()) {
    return NextResponse.json({ error: "missing fields" }, { status: 400 });
  }
  const comment = await addComment(body.slug, {
    name: body.name,
    message: body.message,
    parentId: body.parentId ?? null,
  });
  return NextResponse.json(comment);
}
