// src/lib/r2-client.ts
//
// Cloudflare R2 storage client — replaces Digital Ocean Spaces (do-spaces.ts).
// Uses the same AWS SDK v3 (R2 is S3-compatible).  All legacy export names are
// re-exported as aliases so every consuming file only needs its import path
// changed from "@/lib/r2-client" → "@/lib/r2-client".

import {
  S3Client,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// ── Configuration ────────────────────────────────────────────────────────────

const r2AccountId    = process.env.R2_ACCOUNT_ID    ?? "";
const r2Endpoint     = `https://${r2AccountId}.r2.cloudflarestorage.com`;
const r2BucketName   = process.env.R2_BUCKET_NAME   ?? "";
const r2AccessKeyId  = process.env.R2_ACCESS_KEY_ID ?? "";
const r2SecretKey    = process.env.R2_SECRET_ACCESS_KEY ?? "";

// The custom domain already in use for public asset delivery
const r2PublicBaseUrl =
  process.env.R2_PUBLIC_URL ?? "https://cdn.conceptbuilders.co.ke";

if (!r2AccountId || !r2BucketName || !r2AccessKeyId || !r2SecretKey) {
  // Warn instead of throwing so the app still boots during build-time with
  // empty env vars (edge workers / CI environments).
  console.warn(
    "[r2-client] Missing one or more R2 env vars: " +
      "R2_ACCOUNT_ID, R2_BUCKET_NAME, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY",
  );
}

// ── Client ───────────────────────────────────────────────────────────────────

export const r2Client = new S3Client({
  region: "auto",          // required by SDK; R2 ignores the value
  endpoint: r2Endpoint,
  credentials: {
    accessKeyId:     r2AccessKeyId,
    secretAccessKey: r2SecretKey,
  },
  // forcePathStyle: true — optional, only needed if virtual-host style fails
});

export const R2_BUCKET_NAME  = r2BucketName;
export const R2_ENDPOINT     = r2Endpoint;
export const R2_PUBLIC_URL   = r2PublicBaseUrl;

// ── URL helpers ──────────────────────────────────────────────────────────────

/**
 * Build the public CDN URL for a given object key.
 * Matches the existing cdn.conceptbuilders.co.ke custom domain.
 */
export const getR2PublicUrl = (key: string): string => {
  const normalizedKey = key.replace(/^\/+/, "");
  return `${r2PublicBaseUrl}/${normalizedKey}`;
};

/**
 * Extract the object key from any R2/CDN/DO-Spaces URL.
 * Works with:
 *   https://cdn.conceptbuilders.co.ke/<key>
 *   https://<account>.r2.cloudflarestorage.com/<bucket>/<key>
 *   https://conceptbuilders.sfo3.digitaloceanspaces.com/<key>   (legacy)
 */
export const getR2KeyFromUrl = (fileUrl: string): string => {
  try {
    const url = new URL(fileUrl);
    let pathname = url.pathname.replace(/^\/+/, "");

    // Strip bucket prefix for path-style R2 URLs (/<bucket>/<key>)
    if (pathname.startsWith(`${r2BucketName}/`)) {
      pathname = pathname.slice(r2BucketName.length + 1);
    }

    return pathname;
  } catch {
    return fileUrl;
  }
};

// ── Presigned upload URL ─────────────────────────────────────────────────────

/**
 * Generate a presigned PUT URL so the browser can upload directly to R2.
 * Use expiresIn 7200 (2 h) for normal files; pass a larger value for big files.
 */
export const getSignedUrlForUpload = async (
  fileName: string,
  contentType: string,
  expiresIn = 7200,
): Promise<{ signedUrl: string; publicUrl: string; key: string }> => {
  const key = `uploads/${Date.now()}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket:      r2BucketName,
    Key:         key,
    ContentType: contentType,
    // Note: R2 does not support ACL — bucket access is controlled via
    // Cloudflare R2 bucket settings and the custom CDN domain.
  });

  const signedUrl = await getSignedUrl(r2Client, command, { expiresIn });
  const publicUrl = getR2PublicUrl(key);
  return { signedUrl, publicUrl, key };
};

// ── Presigned download URLs ──────────────────────────────────────────────────

export const getSignedUrlForFiles = async (
  keys: string[],
): Promise<string[]> => {
  return Promise.all(
    keys.map((key) => {
      const command = new GetObjectCommand({
        Bucket: r2BucketName,
        Key:    key,
      });
      return getSignedUrl(r2Client, command, { expiresIn: 900 });
    }),
  );
};

// ── Single-part upload (≤ 300 MB recommended) ────────────────────────────────

export const uploadFile = async (
  fileBuffer: Buffer,
  fileName: string,
  contentType: string,
): Promise<{ publicUrl: string; key: string }> => {
  const key = `uploads/${Date.now()}-${fileName}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket:      r2BucketName,
      Key:         key,
      Body:        fileBuffer,
      ContentType: contentType,
    }),
  );

  return { publicUrl: getR2PublicUrl(key), key };
};

// ── Multipart / streaming upload (> 300 MB, up to 5 TiB) ────────────────────

/**
 * Upload any file using @aws-sdk/lib-storage's `Upload` class.
 * The SDK automatically splits the body into 10 MiB parts and uploads 4 in
 * parallel, retrying failed parts automatically — ideal for large or slow uploads.
 *
 * @param body        Buffer | ReadableStream | Blob
 * @param fileName    Original file name (used to derive the storage key)
 * @param contentType MIME type
 * @param onProgress  Optional progress callback: (bytesLoaded, totalBytes?)
 */
export const uploadLargeFile = async (
  body: Buffer | NodeJS.ReadableStream | Blob,
  fileName: string,
  contentType: string,
  onProgress?: (loaded: number, total?: number) => void,
): Promise<{ publicUrl: string; key: string }> => {
  const key = `uploads/${Date.now()}-${fileName}`;

  const multipart = new Upload({
    client: r2Client,
    params: {
      Bucket:      r2BucketName,
      Key:         key,
      Body:        body,
      ContentType: contentType,
    },
    queueSize:          4,                // parallel parts
    partSize:           10 * 1024 * 1024, // 10 MiB per part
    leavePartsOnError:  false,            // auto-abort on failure
  });

  if (onProgress) {
    multipart.on("httpUploadProgress", (p) =>
      onProgress(p.loaded ?? 0, p.total),
    );
  }

  await multipart.done();
  return { publicUrl: getR2PublicUrl(key), key };
};

// ── Delete ───────────────────────────────────────────────────────────────────

export const deleteFile = async (key: string): Promise<void> => {
  try {
    await r2Client.send(
      new DeleteObjectCommand({ Bucket: r2BucketName, Key: key }),
    );
    console.log(`[R2] Deleted: ${key}`);
  } catch (error) {
    console.error(`[R2] Error deleting ${key}:`, error);
    throw error;
  }
};

export const deleteFiles = async (keys: string[]): Promise<void> => {
  if (keys.length === 0) return;

  try {
    await r2Client.send(
      new DeleteObjectsCommand({
        Bucket: r2BucketName,
        Delete: { Objects: keys.map((Key) => ({ Key })) },
      }),
    );
    console.log(`[R2] Deleted ${keys.length} file(s).`);
  } catch (error) {
    console.error("[R2] Error bulk-deleting files:", error);
    throw error;
  }
};

// ── Backward-compat aliases ──────────────────────────────────────────────────
// Every file that imports from "@/lib/r2-client" only needs its import path
// changed to "@/lib/r2-client" — all symbol names continue to work.

export const s3Client              = r2Client;
export const DO_SPACES_BUCKET_NAME = R2_BUCKET_NAME;
export const DO_SPACES_ENDPOINT    = R2_ENDPOINT;
export const DO_SPACES_REGION      = "auto" as const;
export const getDoSpacesPublicUrl  = getR2PublicUrl;
export const getDoSpacesKeyFromUrl = getR2KeyFromUrl;
