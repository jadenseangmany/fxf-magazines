import { blobEnabled } from "@/lib/blob";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ blob: blobEnabled() });
}
