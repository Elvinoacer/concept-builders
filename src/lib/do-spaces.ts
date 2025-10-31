// src/lib/do-spaces.ts
import {
  S3Client,
  DeleteObjectCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3Client = new S3Client({
  endpoint: `https://sfo3.digitaloceanspaces.com`,
  region: "sfo3",
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY!,
  },
});

export const getSignedUrlForUpload = async (
  fileName: string,
  contentType: string
) => {
  const key = `designs/${Date.now()}-${fileName}`;
  const command = new PutObjectCommand({
    Bucket: process.env.DO_SPACES_BUCKET!,
    Key: key,
    ContentType: contentType,
    ACL: "public-read",
  });
  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  const publicUrl = `https://${process.env.DO_SPACES_BUCKET}.sfo3.digitaloceanspaces.com/${key}`;
  return { signedUrl, publicUrl, key };
};

export const getSignedUrlForFiles = async (keys: string[]) => {
  const signedUrls = await Promise.all(
    keys.map(async (key) => {
      const command = new GetObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET!,
        Key: key,
      });
      return getSignedUrl(s3Client, command, { expiresIn: 3600 });
    })
  );
  return signedUrls;
};

export const deleteFile = async (key: string) => {
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET!,
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
    Bucket: process.env.DO_SPACES_BUCKET!,
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
