// src/lib/do-spaces.ts
import {
  S3Client,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const doSpacesRegion = process.env.DO_SPACES_REGION || "sfo3";
const doSpacesEndpoint =
  process.env.DO_SPACES_ENDPOINT || `https://${doSpacesRegion}.digitaloceanspaces.com`;
const doSpacesBucket = process.env.DO_SPACES_BUCKET;
const doSpacesAccessKey = process.env.DO_SPACES_ACCESS_KEY;
const doSpacesSecretKey = process.env.DO_SPACES_SECRET_KEY;

if (!doSpacesBucket || !doSpacesAccessKey || !doSpacesSecretKey) {
  throw new Error(
    "Missing required DigitalOcean Spaces env vars: DO_SPACES_BUCKET, DO_SPACES_ACCESS_KEY, DO_SPACES_SECRET_KEY"
  );
}

const endpointUrl = new URL(doSpacesEndpoint);

export const DO_SPACES_REGION = doSpacesRegion;
export const DO_SPACES_ENDPOINT = doSpacesEndpoint;
export const DO_SPACES_BUCKET_NAME = doSpacesBucket;

export const getDoSpacesPublicUrl = (key: string) => {
  const normalizedKey = key.replace(/^\/+/, "");

  if (endpointUrl.host === `${doSpacesRegion}.digitaloceanspaces.com`) {
    return `${endpointUrl.protocol}//${doSpacesBucket}.${endpointUrl.host}/${normalizedKey}`;
  }

  return `${endpointUrl.protocol}//${endpointUrl.host}/${doSpacesBucket}/${normalizedKey}`;
};

export const getDoSpacesKeyFromUrl = (fileUrl: string) => {
  const url = new URL(fileUrl);
  const rawPath = url.pathname.replace(/^\/+/, "");

  if (url.host.startsWith(`${doSpacesBucket}.`)) {
    return rawPath;
  }

  if (rawPath.startsWith(`${doSpacesBucket}/`)) {
    return rawPath.slice(doSpacesBucket.length + 1);
  }

  return rawPath;
};

export const s3Client = new S3Client({
  endpoint: doSpacesEndpoint,
  region: doSpacesRegion,
  credentials: {
    accessKeyId: doSpacesAccessKey,
    secretAccessKey: doSpacesSecretKey,
  },
});

export const getSignedUrlForUpload = async (
  fileName: string,
  contentType: string
) => {
  const key = `designs/${Date.now()}-${fileName}`;
  const command = new PutObjectCommand({
    Bucket: doSpacesBucket,
    Key: key,
    ContentType: contentType,
    ACL: "public-read",
  });
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 7200 }); // 2 hours for large uploads
  const publicUrl = getDoSpacesPublicUrl(key);
  return { signedUrl, publicUrl, key };
};

export const getSignedUrlForFiles = async (keys: string[]) => {
  const signedUrls = await Promise.all(
    keys.map(async (key) => {
      const command = new GetObjectCommand({
        Bucket: doSpacesBucket,
        Key: key,
      });
      return getSignedUrl(s3Client, command, { expiresIn: 900 });
    })
  );
  return signedUrls;
};


export const uploadFile = async (
  fileBuffer: Buffer,
  fileName: string,
  contentType: string
) => {
  const key = `designs/${Date.now()}-${fileName}`;
  const command = new PutObjectCommand({
    Bucket: doSpacesBucket,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: "public-read",
  });

  await s3Client.send(command);

  const publicUrl = getDoSpacesPublicUrl(key);
  return { publicUrl, key };
};

export const deleteFile = async (key: string) => {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: doSpacesBucket,
        Key: key,
      })
    );
    console.log(`Successfully deleted ${key} from DigitalOcean Spaces.`);
  } catch (error) {
    console.error(`Error deleting ${key} from DigitalOcean Spaces:`, error);
    throw error;
  }
};

export const deleteFiles = async (keys: string[]) => {
  if (keys.length === 0) {
    return;
  }

  const deleteParams = {
    Bucket: doSpacesBucket,
    Delete: {
      Objects: keys.map((key) => ({ Key: key })),
    },
  };

  try {
    await s3Client.send(new DeleteObjectsCommand(deleteParams));
    console.log(
      `Successfully deleted ${keys.length} files from DigitalOcean Spaces.`
    );
  } catch (error) {
    console.error("Error deleting files from DigitalOcean Spaces:", error);
    throw error;
  }
};
