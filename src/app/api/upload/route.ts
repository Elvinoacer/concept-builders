import { NextRequest, NextResponse } from 'next/server';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes

const s3Client = new S3Client({
  endpoint: `https://sfo3.digitaloceanspaces.com`,
  region: 'sfo3',
  credentials: {
    accessKeyId: process.env.DO_SPACES_ACCESS_KEY!,
    secretAccessKey: process.env.DO_SPACES_SECRET_KEY!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const fileKey = req.headers.get('x-file-key');
    const contentType = req.headers.get('content-type');
    const fileName = req.headers.get('x-file-name');

    if (!fileKey || !contentType || !fileName || !req.body) {
      return new NextResponse('Missing file key, content type, file name, or body', { status: 400 });
    }

    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: process.env.DO_SPACES_BUCKET!,
        Key: fileKey,
        Body: req.body,
        ContentType: contentType,
        ACL: 'public-read',
      },
      queueSize: 4, //
      partSize: 1024 * 1024 * 5, // 5MB
      leavePartsOnError: false, 
    });

    upload.on('httpUploadProgress', (progress) => {
      console.log(progress);
    });

    await upload.done();

    const publicUrl = `https://${process.env.DO_SPACES_BUCKET}.sfo3.digitaloceanspaces.com/${fileKey}`;
    return NextResponse.json({ publicUrl, originalFileName: fileName });
  } catch (error) {
    console.error('Upload error:', error);
    return new NextResponse('Upload failed', { status: 500 });
  }
}
