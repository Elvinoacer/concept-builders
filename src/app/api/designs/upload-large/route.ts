/**
 * POST /api/designs/upload-large
 *
 * Server-side streaming upload for files larger than 300 MB (up to 5 TiB).
 *
 * The client sends the file as a raw body (application/octet-stream).
 * This route pipes it directly into Cloudflare R2 via @aws-sdk/lib-storage
 * multipart upload — nothing is buffered in memory.
 *
 * Request headers expected:
 *   x-file-name     : original filename (e.g. "plan.dwg")
 *   content-type    : MIME type  (e.g. "application/octet-stream")
 *   content-length  : (optional) total bytes — enables progress logging
 *
 * Response:
 *   { url: string, key: string, originalFileName: string }
 *
 * For browser uploads prefer the presigned-URL flow
 * (POST /api/designs/generate-upload-url) which bypasses the server entirely
 * and uploads directly to R2 from the browser with XHR progress events.
 * Use this route only when you must proxy through the server.
 */

import { NextRequest, NextResponse } from "next/server";
import { Readable } from "stream";
import { uploadLargeFile } from "@/lib/r2-client";
import { requireAdminOrTeam } from "@/lib/admin-api-auth";

// Allow long-running requests on Vercel Pro / self-hosted
export const maxDuration = 300; // 5 minutes

// Tell Next.js NOT to buffer the body — we stream it ourselves
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { error } = await requireAdminOrTeam();
  if (error) return error;

  try {
    const fileName =
      req.headers.get("x-file-name") ?? `upload-${Date.now()}`;
    const contentType =
      req.headers.get("content-type") ?? "application/octet-stream";

    if (!req.body) {
      return NextResponse.json({ error: "No request body" }, { status: 400 });
    }

    // Convert Web ReadableStream → Node.js Readable so lib-storage can stream
    // part-by-part without ever loading the entire file into memory.
    const nodeStream = Readable.fromWeb(req.body as Parameters<typeof Readable.fromWeb>[0]);

    let lastLogged = 0;
    const { publicUrl, key } = await uploadLargeFile(
      nodeStream,
      fileName,
      contentType,
      (loaded, total) => {
        // Log every ~50 MB so server logs are not flooded
        if (loaded - lastLogged >= 50 * 1024 * 1024) {
          lastLogged = loaded;
          const pct = total ? ((loaded / total) * 100).toFixed(1) : "?";
          console.log(`[upload-large] ${pct}% — ${(loaded / 1e6).toFixed(1)} MB uploaded`);
        }
      },
    );

    return NextResponse.json(
      { url: publicUrl, key, originalFileName: fileName },
      { status: 200 },
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    console.error("[upload-large] Error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
