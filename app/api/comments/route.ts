import { addComment, getComments } from "@/lib/comments";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "missing slug" }, { status: 400 });
  }
  try {
    const comments = await getComments(slug);
    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
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
  try {
    const comment = await addComment(body.slug, {
      name: body.name,
      message: body.message,
      parentId: body.parentId ?? null,
    });
    revalidatePath(`/catalogs/${body.slug}`);
    return NextResponse.json(comment);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
