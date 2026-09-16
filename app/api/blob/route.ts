import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

const pagePath = /^magazines\/[a-z]+-\d{4}\/(cover|page-\d+)\.jpg$/;

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pagePath.test(pathname)) {
          throw new Error("invalid upload path");
        }
        return {
          allowedContentTypes: ["image/jpeg"],
          addRandomSuffix: false,
          allowOverwrite: true,
          maximumSizeInBytes: 8 * 1024 * 1024,
        };
      },
      onUploadCompleted: async () => undefined,
    });
    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 },
    );
  }
}
